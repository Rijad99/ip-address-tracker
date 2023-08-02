//Imports
import { getData } from "./http.js"
import { initMap, setInitialCoordinates, setNewCoordinates } from "./map.js"


//Elements
const ipAddressInfoEl = document.getElementById("ip-address-info")
const searchInputEl = document.getElementById("search-input") 
const headerContentEl = document.getElementById("header-content")



//Global variables
const apiKey = "at_OFxs69ET63CiFP8Z6BtVTkG3y4F6X"
const ipAddressRegExp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
const domainRegExp = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/i


//Functions
const search = e => {
    const value = e.target.value

    if (ipAddressRegExp.test(value) || domainRegExp.test(value)) {
        const query = ipAddressRegExp.test(value) ? `ipAddress=${value}` : `domain=${value}`

        const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&${query}`
        displayLoading(headerContentEl)
    
        getData(url)
            .then(data => {
                setData(data)
                removeLoading(headerContentEl)
                setNewCoordinates(data.location.lat, data.location.lng, data.location.region, data.ip)
                searchInputEl.value = ""
            })
    } else {
        alert("Incorrect IP address or domain!")
    }
}

const setInitialClientData = () => {
    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`
    displayLoading(headerContentEl)
    
    getData(url)
        .then(data => {
            setData(data)
            setInitialCoordinates(data.location.lat, data.location.lng, data.location.region, data.ip)
            removeLoading(headerContentEl)
        })
}

const setData = data => {
    const boxes = ipAddressInfoEl.querySelectorAll(".box")

    boxes.forEach((box, index) => {
        updateBoxInfo(box, index, data)
    })
}

const updateBoxInfo = (box, index, data) => {
    const h5 = box.querySelector("h5")
    const span = box.querySelector("span")

    switch(index) {

        case 0:
            h5.textContent = "IP ADDRESS"
            span.textContent = data.ip
            break

        case 1:
            h5.textContent = "LOCATION"
            span.textContent = `${data.location.region}, ${data.location.country}`
            break

        case 2:
            h5.textContent = "TIMEZONE"
            span.textContent = `UTC ${data.location.timezone}`
            break

        case 3:
            h5.textContent = "ISP"
            span.textContent = data.isp
            break
    }
}

const setFocus = inputEl => {
    inputEl.focus()
}

const displayLoading = (element) => {
    const loadingEl = document.createElement("div")
    loadingEl.className = "ripple"

    element.appendChild(loadingEl)
}

const removeLoading = (element) => {
    const loadingEl = element.querySelector(".ripple")
    loadingEl.remove()

    ipAddressInfoEl.classList.add("show-ip-address-info")
}


//Events
document.addEventListener("DOMContentLoaded", () => {
    setInitialClientData()
    initMap()
    setFocus(searchInputEl)
})

searchInputEl.addEventListener("keyup", e => {
    if (e.code === "Enter" && searchInputEl.value) {
        search(e)
    }
})
