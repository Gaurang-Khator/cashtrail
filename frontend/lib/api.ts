
export interface Expense {
    userId: string,
    expenseId: string, 
    amount: number,
    category: string,
    date: string,
    note: string,
    createdAt: string
}

export interface Income {
    userId: string,
    incomeId: string,
    income: number,
    source: string,
    month: string,
    createdAt: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if(!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined");
}

export async function getExpenses(userId: string): Promise<Expense[]> {
    const res = await fetch(`${API_BASE_URL}/expenses?userId=${userId}`,
        { cache: "no-store"}
    )

    if(!res.ok) {
        throw new Error("Failed to fetch expenses");
    }

    const data = await res.json();
    return data.expenses;
}

export async function addExpense(expense: {
    userId: string,
    amount: number,
    category: string,
    date: string,
    note: string
}) {
    const res = await fetch(`${API_BASE_URL}/expenses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
    })

    if(!res.ok) {
        throw new Error("Failed to add expense");
    }
    return res.json();
}

export async function deleteExpense(userId: string, expenseId: string){
    const res = await fetch(`${API_BASE_URL}/expenses/${expenseId}?userId=${userId}`, {
        method: 'DELETE'
    })

    if(!res.ok) {
        throw new Error("Failed to delete expense!");
    }

    return res.json()
}

export async function updateExpense(expenseId: string, payload:{
    userId: string,
    amount?: number,
    category?: string,
    date?: string,
    note?: string,
}) {
    const res = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
    })

    if(!res.ok) {
        throw new Error("Failed to update expense");
    }

    return res.json();
}



export async function getMonthlyIncome(userId: string, month: string): Promise<Income[]> {
    const res = await fetch(`${API_BASE_URL}/income?userId=${userId}&month=${month}`,
        { cache: "no-store" }
    );
    if(!res.ok) throw new Error("Failed to fetch monthly income");
    const data = await res.json();
    return data.income;
}

export async function setMonthlyIncome(data: {
    userId: string, 
    month: string, 
    source: string,
    income: number,
}) {
    const res = await fetch(`${API_BASE_URL}/income`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if(!res.ok) throw new Error("Failed to set monthly income");
    return res.json();
}

export async function updateIncome(incomeId: string, payload: {
    userId: string,
    month?: string,
    source?: string,
    income?: number,
}) {
    const res = await fetch(`${API_BASE_URL}/income/${incomeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if(!res.ok) throw new Error("Failed to update income");
    return res.json();
}

export async function deleteIncome(userId: string, incomeId: string){
    const res = await fetch(`${API_BASE_URL}/income/${incomeId}?userId=${userId}`, {
        method: 'DELETE'
    });
    if(!res.ok) throw new Error("Failed to delete income!");
    return res.json();
}