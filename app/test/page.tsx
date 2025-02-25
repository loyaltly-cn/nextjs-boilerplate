'use client'

import axios, { AxiosError } from "axios"

export default function test(){

   axios.post('https://nextjs-boilerplate-eight-lemon-49.vercel.app/server/api/welcom-email',{
    email:'1464808104@qq.com',
    name:'loyal'
   }).then(res =>{
    console.log(res);
    
   }).catch((err:AxiosError) =>{
    console.log(err);
    
   })
   
    return() =>(
        <></>
    )
}