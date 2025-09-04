import { useState , useEffect} from 'react'
import './App.css'

type Transactions = {
    id: number;
    amount: number;
    description:string;
    type: 'Expense' | 'Income'; 
};

function App() {
  
  const [transactions, setTransactions] = useState<Transactions[]>(() => {
    const prev = localStorage.getItem('expense');
    return prev ? JSON.parse(prev): [];
  });

  const [amount, setAmount] = useState('');
  const [description, setDescription]= useState('');
  const [type, setType]= useState<'Expense' | 'Income'>('Expense');
  const [edit, setEdit] = useState<number | null>(null);

  useEffect(()=>{
    localStorage.setItem('expense', JSON.stringify(transactions));
  }, [transactions]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(edit!=null){
      setTransactions((prev) => 
        prev.map((transaction) => transaction.id==edit ? 
        {...transaction, amount:Number(amount), description, type}: transaction)
      );
      setEdit(null);
    }
    else {
      const newTransaction = {
        id: Date.now(),
        amount: Number(amount),
        description: description,
        type,
        edit: null
      };
    
      setTransactions((prev) => [...prev, newTransaction]);
    }
    setAmount('');
    setDescription('');
    setType('Expense');
  };

  const handleDelete = (id: number) => {
    setTransactions((prev) => prev.filter((transaction)=> transaction.id!=id)
  )};

  const handleEdit = (transaction : Transactions) => {
    setAmount(String(transaction.amount));
    setDescription(transaction.description);
    setType(transaction.type);
    setEdit(transaction.id);

  }
  return (
    <div className='app-container' >
        <form onSubmit={handleSubmit}>
          <label>Amount in Rupee's</label>
          <input 
            type='number'
            value = {amount}
            onChange={(e)=>setAmount(e.target.value)}
            required
          />
          <label>Description</label>
          <input 
            type='text'
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />
          <label>Type</label>
          <select
            value={type}
            onChange={(e)=>setType(e.target.value as 'Expense' | 'Income')}
          >
            <option value='Expense'>Expense</option>
            <option value='Income'>Income</option>
          </select>

          <button type='submit'>{edit==null ? 'Add' : 'Update'}</button>
        </form>
      
      <ul>
      {transactions.map((transaction)=>(
          <div>
            <li className={transaction.type.toLowerCase()}>{transaction.type}</li>
          <li>₹{transaction.amount} </li>
          <li>{transaction.description}</li>
          
          <div className="transaction-action">
            <button className='delete' onClick={()=>handleDelete(transaction.id)}>Delete</button>
            <button className='edit'onClick={()=>handleEdit(transaction)}>Edit</button>
          </div>
          </div>
      ))}
      </ul>
    </div>
  )
}

export default App
