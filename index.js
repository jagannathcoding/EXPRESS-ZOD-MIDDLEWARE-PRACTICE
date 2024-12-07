/*const express=require('express');
const app=express();

///now declaring middleware
const logRequestDetails=(req,res,next)=>{
    console.log(`${req.method} request made to: ${req.url}`)
    next();
}

app.use(logRequestDetails);


const stopRequest=(req,res,next)=>{
    res.status(403).send('Request Blocked');
};
app.use('/blocked',stopRequest);



app.get('/',(req,res)=>{
    res.send('Hello World');
})

app.get('/about',(req,res)=>{
    res.send('About Page');
})







app.use(express.json());////for posting

let submittedData=[];
app.post('/submit',(req,res)=>{
    const {name,age}=req.body;
    if(!name||!age)
    {
        res.status(404).send('Name and age are requriered');
        return;
    }
    submittedData.push({name,age});
    console.log(`Received name: ${name},age:${age}`);
    res.send(`Data received. Name:${name},Age:${age}`);
});

app.get('/sumitted-data',(req,res)=>{
    if(submittedData.length==0)
    {
        res.send('No data submiiteed');
    }
    else{
        let html='<h1>Submiiteed data</h1><ul>';
        submittedData.forEach(({name,age},index)=>{
            html+=`<l1>${index+1}:Name- ${name},  AGe- ${age}</l1>`;
        });
        html+='</ul>';
        res.send(html);
    }
})

app.post('/blocked',(req,res)=>{
res.send('This route is blocked for Post requests');
});
    


const port=3000;
app.listen(port,()=>{
    console.log('Running on 3000');
})*/







const express=require('express');
const app=express();
const {z}=require('zod');

///now declaring middleware
const logRequestDetails=(req,res,next)=>{
    console.log(`${req.method} request made to: ${req.url}`)
    next();
}

app.use(logRequestDetails);


const stopRequest=(req,res,next)=>{
    res.status(403).send('Request Blocked');
};
app.use('/blocked',stopRequest);



app.get('/',(req,res)=>{
    res.send('Hello World');
})

app.get('/about',(req,res)=>{
    res.send('About Page');
})







app.use(express.json());////for posting

let submittedData=[];
/*const submitSchema=z.object({
    name:z.string().min(1,'Name is required'),
    age:z.number().min(1,'age mist be a positve integer'),
    email:z.string().email('Invalid email address')
})*/


const submitSchema = z.object({
    name: z.string().min(1, 'Name is required'), // Name must be a non-empty string
    age: z.number().int().min(1, 'Age must be a positive integer'), // Age must be a positive integer
    email: z
        .string()
        .email('Invalid email address') // Email must be valid
        .refine(
            (email) =>
                email.endsWith('@google.com') ||
                email.endsWith('@yahoo.com') ||
                email.endsWith('@reddit.com'),
            {
                message: 'Email must end with @google.com, @yahoo.com, or @reddit.com'
            }
        ) // Email must end with specific domains
});




app.post('/submit',(req,res)=>{
   // const {name,age}=req.body;
   //const validDatedData=submitSchema(req.body); 
   try {
    // Validate request body against the schema
    const validatedData = submitSchema.parse(req.body);

    // If validation passes, save the data
    submittedData.push(validatedData);
    console.log(`Received name: ${validatedData.name}, age: ${validatedData.age}, email: ${validatedData.email}`);
    //res.send(`Data received. Name: ${validatedData.name}, Age: ${validatedData.age}, Email: ${validatedData.email}`);
    res.send({
        message:'Data received',
        data:validatedData
    })
} catch (error) {
    // If validation fails, send error message
    res.status(400).send(error.errors.map(err => err.message).join(', '));
}
});

/*
app.post('/submit', (req, res) => {
    try {
        // Validate request body against the schema
        const validatedData = submitSchema.parse(req.body);

        // If validation passes, save the data
        submittedData.push(validatedData);
        console.log(`Received name: ${validatedData.name}, age: ${validatedData.age}, email: ${validatedData.email}`);

        // Respond with success and return validated data
        res.json({
            message: 'Inputs are valid',
            data: validatedData
        });
    } catch (error) {
        // If validation fails, respond with detailed error messages
        if (error.errors) {
            res.status(400).json({
                message: 'Validation failed',
                errors: error.errors.map(err => err.message) // Extract readable error messages
            });
        } else {
            // Handle unexpected errors
            res.status(500).json({ message: 'Server error' });
        }
    }
});*/




app.get('/sumitted-data',(req,res)=>{
    if(submittedData.length==0)
    {
        res.send('No data submiiteed');
    }
    else{
        let html='<h1>Submiiteed data</h1><ul>';
        submittedData.forEach(({name,age,email},index)=>{
            html+=`<l1>${index+1}:Name- ${name},  AGe- ${age}</l1>,Email -${email}`;
        });
        html+='</ul>';
        res.send(html);
    }
})

app.post('/blocked',(req,res)=>{
res.send('This route is blocked for Post requests');
});
    


const port=3000;
app.listen(port,()=>{
    console.log('Running on 3000');
})