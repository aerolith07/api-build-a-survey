import express from 'express'
import connectToDB from './mongo'

connectToDB()

const app = express()
app.use(express.json())

app.get('/', (_,res)=> {
  res.status(200).send({message:'Hello, server is listening'})
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`> Listening on ${PORT}`);
})
