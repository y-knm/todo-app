let todos = []; //タスク管理する配列
let currentFilter = "all"; //現在のフィルター状態
let editingId = null; //編集中のタスクID

// HTML要素
let todoInput, addBtn, todoList, filterBtns, clearCompletedBtn, clearAllBtn;
let totalTasksEl, completedTasksEl, activeTasksEl;

// HTMLの解析が終了したときに実行される処理
document.addEventListener("DOMContentLoaded", () => {
  // HTML要素を取得して、変数に保存する
  todoInput = document.getElementById("todoInput");
  addBtn = document.getElementById("addBtn");
  todoList = document.getElementById("todoList");
  filterBtns = document.querySelectorAll(".filter-btn");
  clearCompletedBtn = document.getElementById("clearCompleted");
  clearAllBtn = document.getElementById("clearAll");
  totalTasksEl = document.getElementById("totalTasks");
  completedTasksEl = document.getElementById("completedTasks");
  activeTasksEl = document.getElementById("activeTasks");

  // 各イベントのリスナーを設定
  addBtn.addEventListener("click", addTodo); // 「+」ボタンがクリックされたらaddTodoメソッドを呼び出す
  todoInput.addEventListener("keypress", (e) => {
    // 入力欄でEnterキーが押されたらaddTodoメソッドを呼び出す
    if (e.key === "Enter") addTodo();
  });

  // localStorageからタスクデータを読み込んで描画
  todos = loadTodos();
  renderTodos();
});

// タスク追加
function addTodo() {
  console.log("called");
  const text = todoInput.value.trim(); // 入力されたテキストを取得し、前後の空白を削除
  console.log(text);
  if (!text) return; // テキストが空なら何もしない

  // 新しいタスクのデータを作成
  const todo = {
    id: Date.now(), // ユニークなIDとして現在時刻のタイムスタンプを使用
    text: text,
    completed: false, // 最初は未完了
  };

  todos.push(todo); // 配列にタスクを追加
  saveTodos(); // タスク追加後にデータを保存 ← 追加
  renderTodos(); // タスクを再描画
  todoInput.value = ""; // 入力欄を空にする
}

// タスク完了切替
function renderTodos() {
  // 実際のタスクを描画する処理（後で詳しく実装）
  todoList.innerHTML = todos
    .map(
      (todo) => `
        <div class="todo-item">
            <span class="todo-text">${todo.text}</span>
        </div>
    `
    )
    .join("");
}

// LocalStorageへの保存
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos)); // todos配列をJSON形式の文字列に変換してlocalStorageに保存
}

// LocalStorageからの読み込み
function loadTodos() {
  const todos = localStorage.getItem("todos"); // localStorageからデータを読み込む
  return todos ? JSON.parse(todos) : []; // JSONオブジェクトに変換して返す
}
