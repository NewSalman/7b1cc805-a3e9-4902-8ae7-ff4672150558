document.addEventListener("DOMContentLoaded", (event) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    
    const pageParam = urlParams.get("page");
    const countParam = urlParams.get("count");
    const columnParam = urlParams.get("column");
    let orderParam = urlParams.get("order") ?? "asc";
    
    let countPerPage = Number.isNaN(parseInt(countParam)) ? 25 : parseInt(countParam);
    const pageCount = Number.isNaN(parseInt(pageParam)) ? 1 : parseInt(pageParam);
    
    const setDataCountBtn = document.getElementById("set-data-count-per-table-btn");
    const setDataCountInput = document.getElementById("set-data-count-per-table-input");

    setDataCountInput.addEventListener("change", (event) => {
        const count = parseInt(event.target.value);

        if(!Number.isNaN(count)) {
            countPerPage = count;
        }

    })

    setDataCountBtn.addEventListener("click", () => {
        createUrl(columnParam, orderParam);
    });


    const tableHeaderId = document.getElementById("id-table-header");
    const tableHeaderName = document.getElementById("name-table-header");
    const tableHeaderPosts = document.getElementById("posts-table-header");
    const tableHeaderFollowers = document.getElementById("followers-table-header");
    const tableHeaderEmail = document.getElementById("email-table-header");
    const tableHeaderPhone = document.getElementById("phone-table-header");

    const tableHeaderIdIcon = document.getElementById("id-table-header-icon");
    const tableHeaderNameIcon = document.getElementById("name-table-header-icon");
    const tableHeaderPostsIcon = document.getElementById("posts-table-header-icon");
    const tableHeaderFollowersIcon = document.getElementById("followers-table-header-icon");
    const tableHeaderEmailIcon = document.getElementById("email-table-header-icon");
    const tableHeaderPhoneIcon = document.getElementById("phone-table-header-icon");

    let order = orderParam === "asc" ? "desc" : "asc";

    const mapIcons = new Map();
    mapIcons.set("id", tableHeaderIdIcon);
    mapIcons.set("name", tableHeaderNameIcon);
    mapIcons.set("posts", tableHeaderPostsIcon);
    mapIcons.set("followers", tableHeaderFollowersIcon);
    mapIcons.set("email", tableHeaderEmailIcon);
    mapIcons.set("phone", tableHeaderPhoneIcon);

    if(columnParam !== null && columnParam !== "") {
        const currentHeaderTapped = mapIcons.get(columnParam)
        
        if(currentHeaderTapped.classList.contains("hidden")) {
            currentHeaderTapped.classList.remove("hidden");
        } else {
            currentHeaderTapped.classList.add("hidden");
        }
    }


    tableHeaderId.addEventListener("click", () => {
        createUrl("id", order);
        
        rotateIcon(tableHeaderIdIcon);
    });

    tableHeaderName.addEventListener("click", () => {
        createUrl("name", order);
        
        rotateIcon(tableHeaderNameIcon);
    });

    tableHeaderPosts.addEventListener("click", () => {
        createUrl("posts", order);
        
        rotateIcon(tableHeaderPostsIcon);
    });

    tableHeaderFollowers.addEventListener("click", () => {
        createUrl("followers", order);
        
        rotateIcon(tableHeaderFollowersIcon);
    });

    tableHeaderEmail.addEventListener("click", () => {
        createUrl("email", order);
        
        rotateIcon(tableHeaderEmailIcon);
    });

    tableHeaderPhone.addEventListener("click", () => {
        createUrl("phone", order);
        
        rotateIcon(tableHeaderPhoneIcon);
    });

    function rotateIcon(element) {

        if(!element.classList.contains("rotate-180")) {
            element.classList.add("rotate-180");
        } else {
            element.classList.remove("rotate-180");
        }
    }


    function createUrl(column, order) {
        let queryParams = "?";

        queryParams += `page=${pageCount}`
        queryParams += `&count=${countPerPage}`

        if(column !== undefined && column !== null && column !== "") {
                
            queryParams += `&column=${column}&order=${order}`
        }


        window.location =  "http://" + window.location.host + queryParams;
    }

    
});

