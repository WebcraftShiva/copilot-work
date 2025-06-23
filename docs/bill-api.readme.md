# BillFree API Documentation

This document outlines the available APIs in BillFree 2.0.

## Bill APIs

The Bill module provides endpoints for creating and managing bills for merchants. These endpoints offer integration with the legacy BillFree system while providing a modern API interface.

There are two sets of endpoints available:
1. **V2 API** - Modern RESTful JSON-based APIs at `/api/v2/bill/*`
2. **Legacy Wrappers** - Compatibility APIs at `/m-api/*` that match original BillFree endpoint signatures

### PDF Bill Upload

Upload a PDF bill to associate with a customer's account.

- **URL**: `/api/v2/bill/pdf`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

**Request Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| auth_token | String | Yes | Authentication token for the merchant |
| user_phone | String | Yes | Customer's phone number |
| dial_code | String | No | Country dial code (default: '91') |
| bill_amount | String | No | Amount of the bill |
| bill_date | String | No | Date of the bill (YYYY-MM-DD) |
| title | String | No | Title of the bill |
| description | String | No | Description of the bill |
| src | String | No | Source/channel of the bill |
| store_identifier | String | No | Store identifier |
| company_name | String | No | Company name |
| send_billid | Boolean | No | Flag to return bill ID in response |
| send_json | Boolean | No | Flag to return JSON response |
| particulars | Array | No | Array of bill items with details |
| bill_file | File | Yes | PDF file to upload (max 5MB) |

**Response**:

```json
{
  "error": false,
  "response": "S1",
  "message": "Bill created successfully",
  "billInfo": {
    "local_bill_id": "12345",
    "server_bill_id": "67890",
    "bill_id": 123,
    "bill_type": "pdf"
  }
}
```

### HTML Bill Creation

Generate an HTML bill from structured data.

- **URL**: `/api/v2/bill/html`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| auth_token | String | Yes | Authentication token for the merchant |
| user_phone | String | Yes | Customer's phone number |
| dial_code | String | No | Country dial code (default: '91') |
| bill_amount | String | No | Total amount of the bill |
| bill_date | String | No | Date of the bill (YYYY-MM-DD) |
| bill_time | String | No | Time of the bill (HH:MM:SS) |
| title | String | No | Title of the bill |
| inv_no | String | No | Invoice number |
| store_identifier | String | No | Store identifier |
| company_name | String | No | Company name |
| firm_name | String | No | Firm name to display on bill |
| display_address | String | No | Display address to show on bill |
| display_phone | String | No | Display phone to show on bill |
| cust_name | String | No | Customer name |
| particulars | Array | No | Array of bill items with details |
| additional_info | Array | No | Additional information for the bill |
| gst_summary | Array | No | GST summary information |
| remarks | String | No | Remarks |

**Response**:

```json
{
  "error": false,
  "response": "S1",
  "message": "HTML bill created successfully",
  "billInfo": {
    "local_bill_id": "12345",
    "server_bill_id": "67890",
    "bill_id": 123,
    "bill_type": "html"
  }
}
```

## Legacy Wrapper APIs

These endpoints provide compatibility with the original BillFree API structure.

### Add Bill (PDF Upload)

Upload a PDF bill to associate with a customer's account.

- **URL**: `/m-api/add-bill`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

**Request Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| auth_token | String | Yes | Authentication token for the merchant |
| phone | String | Yes | Customer's phone number |
| dial_code | String | No | Country dial code (default: '91') |
| amt | String | No | Amount of the bill |
| bill_date | String | No | Date of the bill (YYYY-MM-DD) |
| title | String | No | Title of the bill |
| desc | String | No | Description of the bill |
| src | String | No | Source/channel of the bill |
| store_identifier | String | No | Store identifier |
| comp_name | String | No | Company name |
| send_billid | String | No | Flag to return bill ID in response ('1' or '0') |
| send_json | String | No | Flag to return JSON response ('1' or '0') |
| bill_file | File | Yes | PDF file to upload (max 5MB) |

**Response**:

```json
{
  "error": false,
  "response": "S1",
  "message": "Bill created successfully",
  "billInfo": {
    "local_bill_id": "12345",
    "server_bill_id": "67890",
    "bill_id": 123,
    "bill_type": "pdf"
  }
}
```

### HTML Bill Creation

Generate an HTML bill from structured data.

- **URL**: `/m-api/html-bill`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| auth_token | String | Yes | Authentication token for the merchant |
| phone | String | Yes | Customer's phone number |
| dial_code | String | No | Country dial code (default: '91') |
| amount | String | No | Amount of the bill |
| bill_date | String | No | Date of the bill (YYYY-MM-DD) |
| bill_time | String | No | Time of the bill (HH:MM:SS) |
| title | String | No | Title of the bill |
| inv_no | String | No | Invoice number |
| particulars_json | String | No | JSON string containing bill items |
| store_identifier | String | No | Store identifier |
| comp_name | String | No | Company name |
| html_content | String | No | Optional pre-generated HTML content |

**Response**:

```json
{
  "error": false,
  "response": "S1",
  "message": "HTML bill created successfully",
  "billInfo": {
    "local_bill_id": "12345",
    "server_bill_id": "67890",
    "bill_id": 123,
    "bill_type": "html"
  }
}
```
