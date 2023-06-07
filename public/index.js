document.querySelector("#domainbtn").addEventListener("click", () => {
    copydDomain();
})


function copydDomain() {
    let copyText = document.getElementById("Domain");

    navigator.clipboard.writeText(copyText.innerHTML);
}