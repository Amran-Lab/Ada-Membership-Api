const getCardById =`
Select *
From Card
WHERE card_id = ?;
`
module.exports = { getCardById };