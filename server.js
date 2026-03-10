const http=require("node:http")

let users=[]
let history=[]
let count=0

const server=http.createServer((req,res)=>{

if(req.url==="/signup.html"){
res.writeHead(200,{"Content-Type":"text/html"})
res.end(`

<!DOCTYPE html>
<html>

<head>

<title>Create Account</title>

<style>

body{
font-family:Arial;
background:#f7f3ed;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
margin:0;
}

.card{
background:#fffdf9;
padding:40px;
border-radius:10px;
width:340px;
border:1px solid #e2d5c5;
text-align:center;
}

h2{
margin-bottom:20px;
color:#3b3026;
}

input{
width:100%;
padding:12px;
margin:10px 0;
border:1px solid #dbcab6;
border-radius:6px;
background:#fdfaf6;
}

button{
width:100%;
padding:12px;
background:#d6c2a8;
border:none;
border-radius:6px;
font-weight:bold;
cursor:pointer;
}

button:hover{
background:#c7b095;
}

a{
display:block;
margin-top:15px;
text-decoration:none;
color:#6e5e4e;
}

</style>

</head>

<body>

<div class="card">

<h2>Create Account</h2>

<input id="username" placeholder="Username">
<input id="email" placeholder="Email">
<input id="password" type="password" placeholder="Password">

<button onclick="signup()">Create Account</button>

<p id="msg"></p>

<a href="/">Back</a>

</div>

<script>

async function signup(){

const data={
username:document.getElementById("username").value,
email:document.getElementById("email").value,
password:document.getElementById("password").value
}

const res=await fetch("/signup",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(data)
})

const result=await res.json()

document.getElementById("msg").innerText=result.message

}

</script>

</body>
</html>

`)
return
}

if(req.url==="/signup" && req.method==="POST"){

let body=""

req.on("data",chunk=>{
body+=chunk.toString()
})

req.on("end",()=>{

const data=JSON.parse(body)

users.push(data)

res.writeHead(200,{"Content-Type":"application/json"})
res.end(JSON.stringify({message:"Account created successfully"}))

})

return
}

res.writeHead(200,{"Content-Type":"text/html"})

res.end(`

<!DOCTYPE html>
<html>

<head>

<title>CodeRefine AI</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
}

body{
font-family:Arial;
background:#f7f3ed;
color:#3b3026;
}

header{
background:#e7d9c8;
padding:20px 60px;
display:flex;
justify-content:space-between;
align-items:center;
border-bottom:1px solid #dbcab6;
}

header h1{
font-size:26px;
}

header button{
background:#d6c2a8;
border:none;
padding:10px 20px;
border-radius:6px;
font-weight:bold;
cursor:pointer;
}

.container{
display:flex;
}

.sidebar{
width:220px;
background:#efe5d8;
padding:20px;
min-height:calc(100vh - 80px);
}

.sidebar h3{
margin-bottom:15px;
}

.sidebar ul{
list-style:none;
}

.sidebar li{
padding:8px 0;
border-bottom:1px solid #d8c8b7;
font-size:14px;
}

.sidebar button{
margin-top:20px;
width:100%;
padding:10px;
background:#d6c2a8;
border:none;
border-radius:6px;
cursor:pointer;
}

.main{
flex:1;
padding:40px;
display:grid;
grid-template-columns:1fr 1fr;
gap:25px;
}

.card{
background:#fffdf9;
border:1px solid #e2d5c5;
border-radius:10px;
padding:20px;
display:flex;
flex-direction:column;
}

textarea{
flex:1;
border:none;
background:#fdfaf6;
padding:15px;
font-family:monospace;
font-size:14px;
border-radius:8px;
resize:none;
outline:none;
margin-top:10px;
}

.analyze{
margin-top:15px;
background:#d6c2a8;
border:none;
padding:12px;
border-radius:6px;
font-weight:bold;
cursor:pointer;
}

.output{
background:#fdfaf6;
padding:15px;
border-radius:8px;
font-family:monospace;
white-space:pre-wrap;
min-height:200px;
margin-top:10px;
}

.bar{
height:14px;
background:#ece3d7;
border-radius:10px;
margin-top:20px;
overflow:hidden;
}

.fill{
height:100%;
width:0%;
background:#c8b094;
transition:0.4s;
}

.score{
margin-top:10px;
font-weight:bold;
}

</style>

</head>

<body>

<header>

<h1>CodeRefine AI</h1>

<a href="/signup.html">
<button>Create Account</button>
</a>

</header>

<div class="container">

<div class="sidebar">

<h3>History</h3>

<ul id="historyList"></ul>

<button onclick="newChat()">New Code</button>

</div>

<div class="main">

<div class="card">

<h3>Code Editor</h3>

<textarea id="code" placeholder="Paste your code here..."></textarea>

<button class="analyze" onclick="analyze()">Analyze Code</button>

</div>

<div class="card">

<h3>Analysis Result</h3>

<div class="output" id="result">
Waiting for analysis...
</div>

<div class="bar">
<div class="fill" id="bar"></div>
</div>

<div class="score" id="score">
Code Quality Score: -
</div>

</div>

</div>

</div>

<script>

let history=[]
let count=0

function analyze(){

const code=document.getElementById("code").value

let result=""
let score=10

const indicators=["function","const","let","var","if(","for(","while(","{","}",";","=>"]

let isCode=false

indicators.forEach(k=>{
if(code.includes(k)){
isCode=true
}
})

if(code.trim()===""){
result+="❌ No code detected\\n"
score=0
}

if(!isCode){
result+="❌ Input does not appear to be valid code\\n"
score=0
}

if(code.length<10){
result+="❌ Code too short to analyze\\n"
score=0
}

if(code.includes("var ")){
result+="⚠ Avoid using var. Use let or const\\n\\n"
score-=1
}

if(code.includes("eval(")){
result+="🚨 Security Risk: eval() detected\\n\\n"
score-=2
}

if(code.includes("console.log")){
result+="⚠ Remove console.log in production\\n\\n"
score-=1
}

let open=(code.match(/{/g)||[]).length
let close=(code.match(/}/g)||[]).length

if(open!==close){
result+="❌ Possible missing curly bracket }\\n\\n"
score-=2
}

if(score<0){
score=0
}

if(result===""){
result="✅ No major issues detected"
}

document.getElementById("result").innerText=result
document.getElementById("score").innerText="Code Quality Score: "+score+"/10"

let percent=score*10
document.getElementById("bar").style.width=percent+"%"

count++

history.push("Code "+count)

updateHistory()

}

function updateHistory(){

const list=document.getElementById("historyList")

list.innerHTML=""

history.forEach(name=>{

const li=document.createElement("li")

li.innerText=name

list.appendChild(li)

})

}

function newChat(){

document.getElementById("code").value=""
document.getElementById("result").innerText="Waiting for analysis..."
document.getElementById("score").innerText="Code Quality Score: -"
document.getElementById("bar").style.width="0%"

}

</script>

</body>
</html>

`)

})

server.listen(3000,()=>{
console.log("Server running at http://localhost:3000")
})
