import React, { useState, useEffect } from "react";

function TodoListApp() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    expiresAt: ""
  });

  const [showForm, setShowForm] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [selectedTodoIndex, setSelectedTodoIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => { //The first useEffect hook is used to load data from local storage into the todoList state when the component mounts.
    const localList = localStorage.getItem("LC");
  
    if (localList) {
      const parsedList = JSON.parse(localList);
      setTodoList(parsedList);
    }
  }, []);
  
  useEffect(() => { //
    if (todoList.length === 0) return; // Skip storing initial state if todoList is empty
  
    localStorage.setItem("LC", JSON.stringify(todoList));//If the length is not zero, it means there is data in the todoList that needs to be stored.
  }, [todoList]);
  


  const handleAddClick = () => {
    setShowForm(true);
    setSelectedTodoIndex(null);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const newTodo = { ...formData };
    if (selectedTodoIndex !== null) {
      const updatedTodoList = [...todoList];
      updatedTodoList[selectedTodoIndex] = newTodo;
      setTodoList(updatedTodoList);
      localStorage.setItem("LC", JSON.stringify(updatedTodoList));
    } else {
      setTodoList((prevTodoList) => [...prevTodoList, newTodo]);
      localStorage.setItem("LC", JSON.stringify([...todoList, newTodo]));
    }
    setShowForm(false);
    setFormData({
      name: "",
      age: "",
      expiresAt: ""
    });
    setSelectedTodoIndex(null);
  };
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditClick = (index) => {
    const selectedTodo = todoList[index];
    setFormData(selectedTodo);
    setSelectedTodoIndex(index);
    setShowForm(true);
  };

  const handleDeleteClick = (index) => {
    const updatedTodoList = [...todoList];
    updatedTodoList.splice(index, 1);
    setTodoList(updatedTodoList);
    localStorage.setItem("LC", JSON.stringify(updatedTodoList));
  };

  const isExpired = (expiresAt) => {
    const currentDate = new Date().toISOString().split("T")[0];
    return expiresAt < currentDate;
  };
  const filteredTodoList = todoList.filter((todo) =>
    todo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-4xl font-bold my-4">My  To Do App</p>
      <button
        className="bg-red-500 text-black text-3xl font-bold w-20 h-20"
        onClick={handleAddClick}
      >
        +
      </button>
      <div className="flex items-center">
  <input
    className="p-2 border border-gray-400 rounded flex-grow"
    type="text"
    placeholder="Search..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <button className="bg-gray-300 p-2 rounded">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-gray-600"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M8.293 2.293a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414zM5 6a5 5 0 1110 0A5 5 0 015 6z"
        clipRule="evenodd"
      />
    </svg>
  </button>
</div>


      {showForm && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white rounded p-6 shadow-md"
          >
            <label htmlFor="nameInput">Name:</label>
            <input
              id="nameInput"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />

            <label htmlFor="ageInput">Age:</label>
            <input
              id="ageInput"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
            />

            <label htmlFor="expiresAtInput">Expires At:</label>
            <input
              id="expiresAtInput"
              type="date"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleInputChange}
            />

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                {selectedTodoIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8">
        {filteredTodoList.map((todo, index) => (
          <div
            key={index}
            className={`p-4 mb-4 flex items-center ${
              isExpired(todo.expiresAt) ? "bg-red-200" : "bg-green-200"
            }`}
          >
            <p className="font-bold text-green-500 mr-4">{index + 1}.</p>
            <div className="flex-grow">
              <p>Name: {todo.name}</p>
              <p>Age: {todo.age}</p>
              <p>Expires At: {todo.expiresAt}</p>
            </div>
            <div>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                onClick={() => handleEditClick(index)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => handleDeleteClick(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoListApp;