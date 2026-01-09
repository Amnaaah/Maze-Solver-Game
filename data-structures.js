class Node 
{
    constructor(data) 
    {
        this.data = data;
        this.next = null; 
    }
}

class LinkedList 
{
    constructor() 
    {
        this.head = null;
    }
    
    insert(data) 
    {
        let n1 = new Node(data);
        if (this.head === null) 
        {
            this.head = n1;
        }
        else 
        {
            let temp = this.head;
            while (temp.next !== null) 
            {
                temp = temp.next;
            }
            temp.next = n1;
        }
    }
    
    // Insert at front
    insertAtFront(data) 
    {
        let n1 = new Node(data);
        n1.next = this.head;
        this.head = n1;
        console.log("Insert front data");
    }
    
    remove() 
    {
        if (this.head === null) 
        {
            console.log("List is empty");
            return;
        }
        if (this.head.next === null) 
        {
            this.head = null;
            console.log("Remove last data");
            return;
        }
        
        let temp = this.head;
        while (temp.next.next !== null) 
        {
            temp = temp.next;
        }
        temp.next = null;
        console.log("Remove last item");
    }
    
    removeAtFront()
    {
        if (this.head === null) 
        {
            console.log("List is empty");
            return;
        }
        this.head = this.head.next;
        console.log("Removed front data");
    }
    
    insertAt(data, index) 
    {
        let n1 = new Node(data);
        let temp = this.head;
        let count = 1;
        while (count < index - 1) {
            temp = temp.next;
            count++;
        }
        n1.next = temp.next;
        temp.next = n1;
        console.log(data + " Added at " + index);
    }
    
    isEmpty() 
    {
        return this.head === null;
    }
    
    clear() 
    {
        this.head = null;
    }
    
    print() 
    {
        if (this.head === null) 
        {
            console.log("List is empty");
            return;
        }
        let temp = this.head;
        let str = "";
        while (temp !== null)
        {
            str += temp.data + " , ";
            temp = temp.next;
        }
        console.log(str + "null");
    }
}

class Queue 
{
    constructor() 
    {
        this.front = null;
        this.rear = null;
    }
    
    isEmpty() 
    {
        return this.front === null && this.rear === null;
    }
    
    enqueue(data) 
    {
        let n1 = new Node(data);
        if (this.isEmpty()) {
            this.front = n1;
            this.rear = n1;
            console.log(data + " Inserted!!!");
            return;
        }
        this.rear.next = n1;
        this.rear = n1;
        console.log(data + " Inserted!!!");
    }
    
    dequeue() 
    {
        if (this.isEmpty()) 
        {         
            console.log("Queue is Empty!!!");
            return null;
        }
        let val = this.front.data;
        this.front = this.front.next;
        if (this.front === null) 
        {
            this.rear = null;
        }
        console.log(val + " Removed!!!");
        return val;                    
    }
}

class Stack 
{
    constructor() 
    {
        this.top = null;
    }
    
    isEmpty() 
    {
        return this.top === null;
    }
    
    peek() 
    {
        if (this.isEmpty()) return null;
        return this.top.data;
    }
    
    push(data) {
        let n1 = new Node(data);
        n1.next = this.top;
        this.top = n1;
        console.log("pushed " + data);
    }
    
    pop() {
        if (this.isEmpty()) {
            console.log("Stack is empty");
            return null;
        }
        let val = this.top.data;
        this.top = this.top.next;
        console.log(val);
        return val;
    }
}
