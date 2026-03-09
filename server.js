const http = require("node:http")

const server = http.createServer((req,res)=>{

res.writeHead(200,{"Content-Type":"text/html"})

res.end(`<!DOCTYPE html>
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
font-family:Arial, sans-serif;
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

header span{
font-size:14px;
color:#6e5e4e;
}

.hero{
text-align:center;
padding:40px;
}

.hero h2{
font-size:28px;
margin-bottom:10px;
}

.hero p{
color:#6e5e4e;
}

.main{
display:grid;
grid-template-columns:1fr 1fr;
gap:20px;
padding:40px;
}

.editor{
background:#fffdf9;
border:1px solid #e2d5c5;
border-radius:10px;
padding:20px;
display:flex;
flex-direction:column;
}

.editor h3{
margin-bottom:10px;
}

textarea{
flex:1;
border:none;
background:#fdfaf6;
padding:15px;
font-family:monospace;
font-size:14px;
resize:none;
border-radius:8px;
outline:none;
}

.controls{
margin-top:15px;
display:flex;
justify-content:space-between;
align-items:center;
}

button{
background:#d6c2a8;
border:none;
padding:12px 22px;
border-radius:6px;
font-weight:bold;
cursor:pointer;
transition:0.2s;
}

button:hover{
transform:scale(1.05);
background:#c8b094;
}

.stats{
font-size:13px;
color:#6e5e4e;
}

.results{
background:#fffdf9;
border:1px solid #e2d5c5;
border-radius:10px;
padding:20px;
display:flex;
flex-direction:column;
}

.output{
background:#fdfaf6;
padding:15px;
border-radius:8px;
white-space:pre-wrap;
font-family:monospace;
min-height:200px;
}

.scorebar{
margin-top:20px;
height:14px;
background:#ece3d7;
border-radius:10px;
overflow:hidden;
}

.scorefill{
height:100%;
width:0%;
background:#c8b094;
transition:0.4s;
}

.scoretext{
margin-top:10px;
font-weight:bold;
}

footer{
text-align:center;
padding:15px;
margin-top:30px;
border-top:1px solid #e2d5c5;
color:#7a6b5c;
font-size:13px;
}

</style>

</head>

<body>

<header>
<h1>CodeRefine AI</h1>
<span>Generative Code Review Engine</span>
</header>

<div class="hero">
<h2>Smart Code Analysis for Developers</h2>
<p>Paste your code and instantly detect bugs, security risks and improvements.</p>
</div>

<div class="main">

<div class="editor">

<h3>Code Editor</h3>

<textarea id="code" placeholder="Paste your code here..."></textarea>

<div class="controls">
<button onclick="analyze()">Analyze Code</button>
<div class="stats" id="stats">0 characters</div>
</div>

</div>

<div class="results">

<h3>Analysis Result</h3>

<div class="output" id="result">
Waiting for analysis...
</div>

<div class="scorebar">
<div class="scorefill" id="bar"></div>
</div>

<div class="scoretext" id="score">
Code Quality Score: -
</div>

</div>

</div>

<footer>
CodeRefine AI • Built for Hackathon Demo
</footer>

<script>

const textarea=document.getElementById("code")
const stats=document.getElementById("stats")

textarea.addEventListener("input",()=>{
stats.innerText=textarea.value.length+" characters"
})

function analyze(){

const code=textarea.value

let result=""
let score=10

if(code.trim()===""){
result+="❌ No code detected\\n"
score=0
}

if(code.includes("var ")){
result+="⚠ Avoid using var. Use let or const.\\n\\n"
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

if(code.includes("for(") && code.split("for(").length>2){
result+="⚠ Nested loops detected. Time complexity may increase.\\n\\n"
score-=1
}

let lines=code.split("\\n")

lines.forEach((line,index)=>{
if(line.trim().length>0 &&
!line.trim().endsWith(";") &&
!line.includes("{") &&
!line.includes("}") &&
!line.includes("if") &&
!line.includes("for") &&
!line.includes("while")){
result+="⚠ Possible missing semicolon at line "+(index+1)+"\\n\\n"
}
})

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

}

</script>

</body>

</html>`)

})

server.listen(3000,()=>{
console.log("Server running at http://localhost:3000")
})