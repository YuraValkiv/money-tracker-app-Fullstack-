import {FC} from "react";
import TransactionForm from "../components/TransactionForm.tsx";
import {instance} from "../api/axios.api.ts";
import {ICategory, IResponseTransactionLoader, ITransaction} from "../types/types.ts";
import {toast} from "react-toastify";
import TransactionTable from "../components/TransactionTable.tsx";
import {useLoaderData} from "react-router-dom";
import {formatToUSD} from "../helpers/currency.helper.ts";
import Chart from "../components/Chart.tsx";


export const transactionLoader = async () => {
    const categories = await instance.get<ICategory[]>('/categories')
    const transactions = await instance.get<ITransaction[]>('/transactions')
    const totalIncome = await instance.get<number>('/transactions/income/find')
    const totalExpense = await instance.get<number>('/transactions/expense/find')
    const data = {
        categories: categories.data,
        transactions: transactions.data,
        totalIncome: totalIncome.data,
        totalExpense: totalExpense.data,
    }
    return data;
}

export const transactionAction = async ({ request }: any) => {
    switch (request.method) {
        case "POST": {
            const formData = await request.formData()
            const newTransaction = {
                title: formData.get("title"),
                amount: +formData.get("amount"),
                category: formData.get("category"),
                type: formData.get("type")
            }
            await instance.post('/transactions', newTransaction)
            toast.success('Transaction added')
            return null
        }
        case "DELETE": {
            const formData = await request.formData()
            const transactionId = formData.get('id')
            await instance.delete(`/transactions/transaction/${transactionId}`)
            toast.success('Transaction deleted')
            return null
        }
    }
}

const Transactions: FC = () => {
    const { totalExpense, totalIncome } = useLoaderData() as IResponseTransactionLoader
    return <>
        <div className="grid grid-cols-3 gap-4 mt-4 items-start">
            {/* Add Transaction Form */}
            <div className="col-span-2 grid">
                <TransactionForm />
            </div>
            {/*Statistic blocks*/}
            <div className="rounded-md bg-slate-800 p-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="uppercase text-md font-bold text-center">Total Income:</p>
                        <p className="bg-green-600 mt-2 rounded-sm p-1 text-center">{formatToUSD.format(totalIncome)}</p>
                    </div>
                    <div>
                        <p className="uppercase text-md font-bold text-center">Total Expense:</p>
                        <p className="bg-red-500 mt-2 rounded-sm p-1 text-center">{formatToUSD.format(totalExpense)}</p>
                    </div>
                </div>
                <>
                <Chart totalExpense={totalExpense} totalIncome={totalIncome}/>
                </>
            </div>
        </div>
        {/*Transactions table*/}
        <h1 className="my-5">
            <TransactionTable limit={5} />
        </h1>
    </>
};

export default Transactions;
