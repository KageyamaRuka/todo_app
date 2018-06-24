var card = e("#card")
var forntButton = e("#id-button-front")
var backButton = e("#id-button-back")

forntButton.addEventListener('click', function() {
    card.classList.toggle('flipped')
})

backButton.addEventListener('click', function() {
    card.classList.toggle('flipped')
})