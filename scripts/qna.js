document.querySelectorAll(".qnaItemHeader").forEach(
    function(header){

header.addEventListener("click",()=>{
            if(header.parentNode.classList.contains("qnaActive")){
              header.parentNode.classList.remove("qnaActive");
              header.parentNode.style.height= "54px";
              
            }else{
document.querySelectorAll(".qnaItemHeader").forEach(
    function(header){
        header.parentNode.classList.remove("qnaActive");
        header.parentNode.style.height= "54px"
    }
)              
header.parentNode.classList.add("qnaActive");

let altPar=header.nextElementSibling.scrollHeight;
let altura= altPar+54;
header.parentNode.style.height= altura + "px";

               
            }         
        })
    }
);

$("#qnaTab").on("click",function () {
    $('.qnaItemHeader li').click() 
});