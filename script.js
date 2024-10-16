$(".dropdown-menu li a").click(function(){
    const selText = $(this).text();
    $(this).parents('.dropdown').find('.dropdown-bs-toggle').html(selText + ' <i class="d-inline-block bi bi-chevron-down ms-1"></i>');
    
    $(this).parents('.dropdown-menu').find('a').css({"background-color":"#FFFFFF", "color":"#4B5675"});
    $(this).parents('.dropdown-menu').find("i:not(.invisible)").toggleClass("invisible");

    $(this).css({"background-color":"#F9F9F9", "color":"#1B84FF"});
    $(this).find('i').toggleClass("invisible");
});

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

document.addEventListener("DOMContentLoaded", () => {
    followBtnAction();
});

function followBtnAction() {
    document.querySelectorAll("#user-followers-container .card .follow-status-btn").forEach((followBtn) => {
        followBtn.addEventListener("click", (e) => {
            const followStatusBtn = e.currentTarget;
            const followStatusIcon = e.currentTarget.querySelector("i.btn-icon");
            const followSpinnerIcon = e.currentTarget.querySelector("span.spinner-icon");
            const followStatusTextEle = e.currentTarget.querySelector(".follow-status-text");
            const followStatus = e.currentTarget.dataset.followStatus;
            if (followStatus === "follow") {
                followStatusTextEle.textContent = "Please wait...";
                followSpinnerIcon.classList.remove("d-none");
                followStatusIcon.classList.remove("bi-plus");
                followStatusBtn.dataset.followStatus = "f-loading";
                setTimeout(() => {
                    followStatusIcon.classList.add("bi-check");
                    followSpinnerIcon.classList.add("d-none");
                    followStatusTextEle.textContent = "Following";
                    followStatusBtn.dataset.followStatus = "following";
                }, 2000);
            } else if (followStatus === "following") {
                followStatusTextEle.textContent = "Please wait...";
                followSpinnerIcon.classList.remove("d-none");
                followStatusIcon.classList.remove("bi-check");
                followStatusBtn.dataset.followStatus = "fg-loading";
                setTimeout(() => {
                    followStatusIcon.classList.add("bi-plus");
                    followSpinnerIcon.classList.add("d-none");
                    followStatusTextEle.textContent = "Follow";
                    followStatusBtn.dataset.followStatus = "follow";
                }, 2000);
            }
        });
    });
}
