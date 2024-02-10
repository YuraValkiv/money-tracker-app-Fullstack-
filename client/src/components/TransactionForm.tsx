import {FC, useState} from "react";
import {Form, useLoaderData} from "react-router-dom";
import {FaPlus} from "react-icons/fa";
import {IResponseTransactionLoader} from "../types/types.ts";
import CategoryModal from "./CategoryModal.tsx";


const TransactionForm: FC = () => {
    const [visibleModal, setVisibleModal] = useState(false)
    const { categories } = useLoaderData() as IResponseTransactionLoader
    return <div className="rounded-md bg-slate-800 p-4">
        <Form className="grid gap-2"
        method="post"
        action="/transactions">
            <label className="grid" htmlFor="title">
                <span>Title</span>
                <input className="input" name="title" type="text" required placeholder="Title..."/>
            </label>
            <label className="grid" htmlFor="amount">
                <span>Amount</span>
                <input className="input" name="amount" type="number" required placeholder="Amount..."/>
            </label>
            {/*Select*/}
            {categories.length ? <label htmlFor="category" className="grid">
                <span>Category</span>
                <select name="category" className="input" required>
                    {categories.map((ctg, idx) => (
                        <option key={idx} value={ctg.id}>{ctg.title}</option>
                    ))}
                </select>
            </label> : <h1 className="mt-1 text-red-300">To continue create a category first</h1> }


            <button
                onClick={() => setVisibleModal(true)}
                className=" max-w-fit flex items-center gap-2 text-white/50 hover:text-white">
                <FaPlus />
                <span>Manage Categories:</span>
            </button>
            {/*Radio Buttons*/}
            <div className="flex gap-4 items-center">
                <label className="cursor-pointer flex items-center gap-2">
                    <input
                        type="radio"
                        name="type"
                        value={'income'}
                        className='form-radio text-blue-600' />
                    <span>Income</span>
                </label>
                <label className="cursor-pointer flex items-center gap-2">
                    <input
                        type="radio"
                        name="type"
                        value={'expense'}
                        className='form-radio text-blue-600' />
                    <span>Expense</span>
                </label>
            </div>
            {/*Submit button*/}
            <button className="btn btn-green max-w-fit mt-2">Submit</button>
        </Form>
        {visibleModal && (<CategoryModal type="post" setVisibleModal={setVisibleModal}/>)}
    </div>;
};

export default TransactionForm;