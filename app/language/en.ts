export default {
    language:'中文',
    slider:{
        name:'Admin Dashboard',
        options:[{
            text:'Dashboard',
            link:'/',
            auth:false,
            d:'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
        },{
            text:'Users',
            link:'/users',
            auth:true,
            d:'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
        },{
            text:'Appointments',
            link:'/appointments',
            auth:true,
            d:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
        },{
            text:'Intended Parents',
            link:'/surrogacy-applications',
            auth:true,
            d:'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        },{
            text:'Surrogates',
            link:'/surrogates',
            auth:true,
            d:'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        },{
            text:'Chat List',
            link:'/chats',
            auth:true,
            d:'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
        },{
            text:'About Video',
            link:'/about/video',
            auth:true,
            d:'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
        },{
            text:'comments',
            link:'/comments',
            auth:true,
            d:'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
        },{
            text:'information',
            link:'/information',
            auth:true,
            d:'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
        },{
            text:'setting',
            link:'/setting',
            auth:true,
            d:'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
        }]
    },
    dashboard:{
        title:'Dashboard Overview',
        user:'Total Users',
    },
    user:{
        title:'Users',
        th:['Name','Email','Joined','Action']
    },
    login:{
        title:'Login', 
        email:'Email',
        password:'Password',
        other:'Or continue with',
        Register:'Don\'t have an account? Register', 
        pl_email:'Enter your email',
        pl_password:'Enter your password',
    },
    setting:{
        title:'setting',
        old_password:'old password',
        new_password:'new password',
        save:'save',
    }
}