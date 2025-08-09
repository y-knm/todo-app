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

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      setFilter(e.target.dataset.filter);
    });
  });

  clearCompletedBtn.addEventListener("click", clearCompleted);
  clearAllBtn.addEventListener("click", clearAll);

  // localStorageからタスクデータを読み込んで描画
  todos = loadTodos();
  renderTodos();

  // 統計情報の更新
  updateStats();
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
  updateStats(); // 統計情報の更新 ← 追加
  todoInput.value = ""; // 入力欄を空にする
}

// タスク完了切替
function renderTodos() {
  const filteredTodos = getFilteredTodos();

  if (filteredTodos.length === 0) {
    todoList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-clipboard-list" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
        <p style="color: #666; text-align: center;">
          ${
            currentFilter === "all"
              ? "タスクがありません。新しいタスクを追加してください。"
              : currentFilter === "active"
              ? "未完了のタスクがありません。"
              : "完了済みのタスクがありません。"
          }
        </p>
      </div>
    `;
    return;
  }

  todoList.innerHTML = filteredTodos
    .map(
      (todo) => `
        <div class="todo-item ${
          todo.completed ? "completed" : ""
        }" data-todo-id="${todo.id}">
            <input type="checkbox"
                   class="todo-checkbox"
                   ${todo.completed ? "checked" : ""}
                   onchange="toggleTodo(${todo.id})">

            <span class="todo-text">${todo.text}</span>

            <div class="todo-actions">
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
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

// タスク完了切替
function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id); // IDでタスクを検索
  if (todo) {
    todo.completed = !todo.completed; // completedプロパティを反転させる
    saveTodos();
    renderTodos();
    updateStats(); // 追加
  }
}

// タスク削除
function deleteTodo(id) {
  // 確認ダイアログを表示
  if (confirm("このタスクを削除しますか？")) {
    todos = todos.filter((t) => t.id !== id); // IDが一致しないタスクだけを残す
    saveTodos();
    renderTodos();
    updateStats(); // 追加
  }
}

// 統計更新
function updateStats() {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;

  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  activeTasksEl.textContent = active;
}

// フィルタ切替
function setFilter(filter) {
  currentFilter = filter; // 現在のフィルター状態を更新

  // ボタンのアクティブ状態を更新
  filterBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });

  renderTodos(); // フィルターを適用して再描画
}

// フィルタ適用
function getFilteredTodos() {
  switch (currentFilter) {
    case "active":
      return todos.filter((t) => !t.completed);
    case "completed":
      return todos.filter((t) => t.completed);
    default: // "all" の場合
      return todos;
  }
}

//以下の文章は要れる場所違うかもしれない．違ったら直す

// 完了済み削除
function clearCompleted() {
  if (confirm("完了済みのタスクをすべて削除しますか？")) {
    todos = todos.filter((t) => !t.completed); // 未完了のタスクだけを残す
    saveTodos();
    renderTodos();
    updateStats();
  }
}

// 全削除
function clearAll() {
  if (confirm("すべてのタスクを削除しますか？この操作は元に戻せません。")) {
    todos = []; // 配列を空にする
    saveTodos();
    renderTodos();
    updateStats();
  }
}
