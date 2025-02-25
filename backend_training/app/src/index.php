<?php
require_once 'config.php'; // 設定ファイルを読み込み

// レスポンスのヘッダーを設定
// JSON形式で返すためのヘッダー
header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

// Strip out query parameters by getting only the path
$requestUri = $_SERVER['REQUEST_URI']; // This strips out the query string

// Now $requestUri will only have the path, and no query parameters
global $pdo;

$routes = [
    'GET' => [
        '#^/todos$#' => 'handleGetTodos',  // Match only `/todos` with no query params or other path
        '#^/health$#' => 'handleHealthCheck',
        // TODO: 他のエンドポイントを追加
        '#^/todos/(\d+)$#' => 'handleGetTodoById',
    ],
    'POST' => [
        // TODO: 他のエンドポイントを追加
        '#^/todos$#' => 'handleCreateTodo',
    ],
    'PUT' => [
        // TODO: 他のエンドポイントを追加
        '#^/todos\?id=(\d+)$#' => 'handleUpdateTodo',
    ],
    'DELETE' => [
        // TODO: 他のエンドポイントを追加
        '#^/todos\?id=(\d+)$#' => 'handleDeleteTodo',
    ],
    'OPTIONS' => [
        '#^.*$#' => 'handleOptions'
    ]
];

if (isset($routes[$method])) {
    foreach ($routes[$method] as $pattern => $handler) {
        if (preg_match($pattern, $requestUri, $matches)) {
            array_shift($matches);
            call_user_func_array($handler, array_merge([$pdo], $matches));
            exit;
        }
    }
}

http_response_code(404);
echo json_encode(['error' => 'Not Found']);
exit;

/**
 * `/health` エンドポイントを処理します。
 *
 * @param PDO $pdo データベース接続のためのPDOインスタンス
 * @return void
 */
function handleHealthCheck(PDO $pdo): void
{
    try {
        // データベース接続を確認
        $stmt = $pdo->query("SELECT 1");
        $result = $stmt->fetchColumn();

        if ($result == 1) {
            // データベース接続が正常の場合のレスポンス
            echo json_encode(['status' => 'ok', 'database' => 'connected']);
        } else {
            // データベース応答なしの場合のエラーレスポンス
            throw new RuntimeException('Database connection failed');
        }
    } catch (Exception $e) {
        // クエリエラー時のレスポンス
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Database connection failed',
            'error' => $e->getMessage()
        ]);
    }
    exit;
}

/**
 * `/todos` エンドポイントを処理します。
 *
 * @param PDO $pdo データベース接続のためのPDOインスタンス
 * @return void
 */
function handleGetTodos(PDO $pdo): void
{
    try {
        // データベースからTodoリストを取得
        $stmt = $pdo->query("SELECT todos.id, todos.title, statuses.name FROM todos JOIN statuses ON todos.status_id = statuses.id;");
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // レスポンスを返却
        echo json_encode(['status' => 'ok', 'data' => $result]);
    } catch (Exception $e) {
        // クエリエラー時のレスポンス
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to get todos',
            'error' => $e->getMessage()
        ]);
    }
    exit;
}

/**
 * `/todos/{id}` エンドポイントを処理します。
 *
 * @param PDO $pdo データベース接続のためのPDOインスタンス
 * @return void
 */
function handleGetTodoById(PDO $pdo, int $id): void
{
    try {
        // データベースからTodoリストを取得
        $stmt = $pdo->prepare("SELECT todos.id, todos.title, statuses.name AS status FROM todos JOIN statuses ON todos.status_id = statuses.id WHERE todos.id = :id;");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        $todo = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($todo) {
            // Todoが見つかった場合
            echo json_encode(['status' => 'ok', 'data' => [$todo]]);
        } else {
            // Todoが見つからなかった場合 (HTTP 404)
            http_response_code(404);
            echo json_encode(['error' => 'Todoが見つかりません']);
        }
    } catch (Exception $e) {
        // クエリエラー時のレスポンス
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to get todos',
            'error' => $e->getMessage()
        ]);
    }
    exit;
}

/**
 * `/todos/` エンドポイントを処理します。
 *
 * @param PDO $pdo データベース接続のためのPDOインスタンス
 * @return void
 */
function handleCreateTodo(PDO $pdo): void
{
    try {
        // リクエストボディをJSON形式で受け取る
        $input = json_decode(file_get_contents('php://input'), true);

        // バリデーション: `title` が空の場合はエラー
        if (empty($input['title'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Title is required']);
            exit;
        }

        $title = trim($input['title']);

        // 新しいTodoをデータベースに挿入
        $stmt = $pdo->prepare("INSERT INTO todos (title, status_id) VALUES (:title, 1)");
        $stmt->bindParam(':title', $title, PDO::PARAM_STR);
        $stmt->execute();

        // 挿入したレコードのIDを取得
        $id = $pdo->lastInsertId();

        // 作成されたTodoを取得
        $stmt = $pdo->prepare("SELECT todos.id, todos.title, statuses.name AS status FROM todos JOIN statuses ON todos.status_id = statuses.id WHERE todos.id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $todo = $stmt->fetch(PDO::FETCH_ASSOC);

        // レスポンス (HTTP 201)
        http_response_code(201);
        echo json_encode(['status' => 'ok', 'data' => [$todo]]);
    } catch (Exception $e) {
        // クエリエラー時のレスポンス
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to create todos',
            'error' => $e->getMessage()
        ]);
    }
    exit;
}

/**
 * `/todos` のTodoを更新するエンドポイント
 *
 * @param PDO $pdo データベース接続のためのPDOインスタンス
 * @return void
 */
function handleUpdateTodo(PDO $pdo): void
{
    try {
        // クエリパラメータから `id` を取得
        if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID is required and must be a number']);
            exit;
        }
        $id = (int)$_GET['id'];

        // リクエストボディをJSON形式で受け取る
        $input = json_decode(file_get_contents('php://input'), true);

        // バリデーション: `title` または `completed` が指定されているか確認
        if (!isset($input['title']) && !isset($input['completed'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Either title or completed is required']);
            exit;
        }

        // 更新内容を設定
        $updateFields = [];
        $params = [':id' => $id];

        if (isset($input['title']) && !empty(trim($input['title']))) {
            $updateFields[] = 'title = :title';
            $params[':title'] = trim($input['title']);
        }

        if (isset($input['completed'])) {
            $completed = (int)$input['completed'];

            // `completed` の値を `status_id` にマッピング
            $statusMap = [
                1 => 1, // 未完了 (Not Completed)
                2 => 2, // 完了 (Completed)
                3 => 3  // 進行中 (In Progress)
            ];

            // 指定された `completed` が 1, 2, 3 以外の場合はエラー
            if (!array_key_exists($completed, $statusMap)) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid completed value']);
                exit;
            }

            $updateFields[] = 'status_id = :status_id';
            $params[':status_id'] = $statusMap[$completed];
        }

        if (empty($updateFields)) {
            http_response_code(400);
            echo json_encode(['error' => 'No valid fields to update']);
            exit;
        }

        // SQLクエリを組み立てて更新処理を実行
        $sql = "UPDATE todos SET " . implode(', ', $updateFields) . " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        // 更新後のデータを取得
        $stmt = $pdo->prepare("SELECT todos.id, todos.title, statuses.name AS status FROM todos JOIN statuses ON todos.status_id = statuses.id WHERE todos.id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $todo = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($todo) {
            // 成功時のレスポンス
            http_response_code(200);
            echo json_encode(['status' => 'ok', 'data' => [$todo]]);
        } else {
            // Todoが見つからなかった場合 (HTTP 404)
            http_response_code(404);
            echo json_encode(['error' => 'Todoが見つかりません']);
        }
    } catch (Exception $e) {
        // クエリエラー時のレスポンス
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to update todo',
            'error' => $e->getMessage()
        ]);
    }
    exit;
}

/**
 * `/todos?id={id}` のTodoを削除するエンドポイント
 *
 * @param PDO $pdo データベース接続のためのPDOインスタンス
 * @return void
 */
function handleDeleteTodo(PDO $pdo): void
{
    try {
        // クエリパラメータから `id` を取得
        if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID is required and must be a number']);
            exit;
        }
        $id = (int)$_GET['id'];

        // 削除対象のTodoを取得
        $stmt = $pdo->prepare("SELECT todos.id, todos.title, statuses.name AS status FROM todos JOIN statuses ON todos.status_id = statuses.id WHERE todos.id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $todo = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$todo) {
            // Todoが見つからなかった場合 (HTTP 404)
            http_response_code(404);
            echo json_encode(['error' => 'Todoが見つかりません']);
            exit;
        }

        // Todoを削除
        $stmt = $pdo->prepare("DELETE FROM todos WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        // 削除成功時のレスポンス
        http_response_code(200);
        echo json_encode([
            'status' => 'ok',
            // 'message' => 'Todo deleted successfully',
            'data' => [$todo]
        ]);
    } catch (Exception $e) {
        // クエリエラー時のレスポンス
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to delete todo',
            'error' => $e->getMessage()
        ]);
    }
    exit;
}

/**
 * OPTIONS リクエストを処理する
 * CORSヘッダーを設定して 200 OK レスポンスを返す
 *
 * @return void
 */
function handleOptions(): void
{
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    exit;
}
