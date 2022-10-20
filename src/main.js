import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    jcb: [("#BBC7C8", "#668698")],
    discover: [("#00F0FF", "#F3DC08")],
    hipercard: [("#FFB800", "#70F308")],
    elo: [("#F600B1", "#00AEEF")],
    amex: [("#6100FF", "#F308DC")],
    visa: [("#436D99", "#2D57F2")],
    mastercard: [("#DF6F29", "#C69347")],
    default: [("black", "gray")],
  }
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

// Aqui defino as mascaras e regex das bandeiras

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex:
        /^4011(78|79)|^43(1274|8935)|^45(1416|7393|763(1|2))|^50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9])|^627780|^63(6297|6368|6369)|^65(0(0(3([1-3]|[5-9])|4([0-9])|5[0-1])|4(0[5-9]|[1-3][0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8]|4[1-9]|[5-8][0-9]|9[0-8])|7(0[0-9]|1[0-8]|2[0-7])|9(0[1-9]|[1-6][0-9]|7[0-8]))|16(5[2-9]|[6-7][0-9])|50(0[0-9]|1[0-9]|2[1-9]|[3-4][0-9]|5[0-8]))/,
      cardtype: "elo",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^3[47][0-9]{13}$/,
      cardtype: "amex",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^6(?:011|5[0-9]{2})[0-9]{12}/,
      cardtype: "discover",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:2131|1800|35\d{3})\d{11}/,
      cardtype: "jcb",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^3[1-8]\d{0,2}|^6[0-9]\d/,
      cardtype: "hipercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appendend, dynamicMasked) {
    const number = (dynamicMasked.value + appendend).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(({ regex }) =>
      number.match(regex)
    )

    return foundMask
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão Adicionado")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

//Aqui escrevo uma função que substitui o valor anterior pelo oq esta sendo escrito

const elementValue = document.querySelector("#card-holder")
elementValue.addEventListener("input", () => {
  const elementContainer = document.querySelector(".cc-holder .value")
  elementContainer.innerText =
    elementValue.value.length === 0 ? "FULANO DA SILVA" : elementValue.value
})
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9010 1023" : number
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
