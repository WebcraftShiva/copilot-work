import axios from 'axios';

const url = 'https://jsonplaceholder.typicode.com/posts/1';

interface Todo{
    userId: number;
    id: number;
    title: string;
    body: string;
}

axios.get(url).then(response =>{
    const todo = response.data as Todo;

    const userId = todo.userId;
    const id = todo.id;
    const title = todo.title;
    const body = todo.body;

    // logTodo(id, title,userId, body);   // // This will not work because the order of the parameters is wrong'
    logTodo(id, title, body, userId); // This will work because the order of the parameters is correct
})

const logTodo = (id:number, title:string, body:string, userId: number)=>{
    console.log(`
        The Todo with id: ${id} has the title: ${title} witht the content in body: ${body}
        has a userId of: ${userId}
        `)
}
