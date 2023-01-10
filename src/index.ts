import { ACCOUNT_TYPE } from './types';
import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})

app.get("/accounts/:id", (req: Request, res: Response) => {
    const id = req.params.id as string

    const result = accounts.find((account) => {
        return account.id === id
    })

    res.status(200).send(result)
})

app.delete("/accounts/:id", (req: Request, res: Response) => {
    const id = req.params.id as string

    const accountIndex = accounts.findIndex((account) => {
        return account.id === id
    })

    if(accountIndex >= 0){
        accounts.splice(accountIndex, 1)
        res.status(200).send("Conta deletada com sucesso.")
    }

    res.status(404).send("Conta não encontrada.")    
})

app.put("/accounts/:id", (req: Request, res: Response) => {
    const id = req.params.id as string
    
    const newId = req.body.id as string | undefined
    const newOwnerName = req.body.ownerName as string | undefined
    const newBalance = req.body.balance as number | undefined
    const newType = req.body.type as ACCOUNT_TYPE | undefined

    const accountToBeEdited = accounts.find((account) => {
        return account.id === id
    })

    if(accountToBeEdited){
        accountToBeEdited.id = newId || accountToBeEdited.id
        accountToBeEdited.ownerName = newOwnerName || accountToBeEdited.ownerName
        accountToBeEdited.balance = isNaN(newBalance) ? accountToBeEdited.balance : newBalance
        accountToBeEdited.type = newType || accountToBeEdited.type

        res.status(200).send("Atualização realizada com sucesso.")
    }

    res.status(404).send("Conta não encontrada.")

})