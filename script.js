document.addEventListener("DOMContentLoaded", function(){

// Loader
window.addEventListener("load", function(){
    setTimeout(()=>{
        document.getElementById("loader").style.display="none";
    },1500);
});

// Typing
const text = "Asjad Pathan – Architect of the Code Universe";
let i = 0;
function typing(){
    if(i < text.length){
        document.querySelector(".typing").innerHTML += text.charAt(i);
        i++;
        setTimeout(typing,50);
    }
}
typing();

// Scroll Reveal
window.addEventListener("scroll", function(){
    document.querySelectorAll(".reveal").forEach(el=>{
        if(el.getBoundingClientRect().top < window.innerHeight - 100){
            el.classList.add("active");
        }
    });

    // Animate Skill Bars
    document.querySelectorAll(".bar").forEach(bar=>{
        if(bar.getBoundingClientRect().top < window.innerHeight - 50){
            bar.style.width = bar.getAttribute("data-width");
        }
    });
});

// Theme Toggle
document.getElementById("themeToggle").addEventListener("click", function(){
    document.body.classList.toggle("light-mode");
});

// Music Toggle
const music = document.getElementById("spaceMusic");
const musicBtn = document.getElementById("musicToggle");

musicBtn.addEventListener("click", function(){
    if(music.paused){
        music.play();
        musicBtn.innerHTML="🔇 Mute";
    } else {
        music.pause();
        musicBtn.innerHTML="🔊 Sound";
    }
});

// Form + LocalStorage
const form = document.getElementById("feedbackForm");
const popup = document.getElementById("successPopup");
const feedbackList = document.getElementById("feedbackList");

loadFeedback();

form.addEventListener("submit", function(e){
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();

    if(name === ""){
        alert("Name cannot be empty");
        return;
    }

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        alert("Enter valid email");
        return;
    }

    const feedback = {name, message};
    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    feedbacks.push(feedback);
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

    popup.innerHTML="🚀 Message Launched Successfully!";
    form.reset();
    loadFeedback();
});

function loadFeedback(){
    feedbackList.innerHTML="<h3>Galaxy Messages:</h3>";
    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    feedbacks.forEach(f=>{
        feedbackList.innerHTML += `
        <div class="glass">
            <h4>🚀 ${f.name}</h4>
            <p>${f.message}</p>
        </div>`;
    });
}

});