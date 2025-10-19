---
title: C++新特性构建线程池
date: 2025-10-18
categories:
  - 编程
tags:
  - C++
  - C++新特性
  - 多线程
  - 后端
---

## C++新特性线程池

### Thread_Pool 头文件

```cpp
#ifndef THREAD_POOL_H
#define THREAD_POOL_H

#include <vector>
#include <queue>
#include <memory>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <future>
#include <functional>
#include <stdexcept>

class ThreadPool {
public:
    ThreadPool(size_t);
    
    template<class F, class... Args>
    auto enqueue(F&& f, Args&&... args) 
        -> std::future<typename std::result_of<F(Args...)>::type>;
        
    ~ThreadPool();

private:
    std::vector<std::thread> workers;
    std::queue<std::function<void()>> tasks;
    std::mutex queue_mutex;
    std::condition_variable condition;
    bool stop;
};

#endif
```

### Thread_Pool 实现

```cpp
#include "ThreadPool.h"

ThreadPool::ThreadPool(size_t threads) : stop(false) {
    for (size_t i = 0; i < threads; ++i) {
        workers.emplace_back([this] {
            for (;;) {
                std::function<void()> task;
                {
                    std::unique_lock<std::mutex> lock(this->queue_mutex);
                    this->condition.wait(lock, [this] { 
                        return this->stop || !this->tasks.empty(); 
                    });
                    
                    if (this->stop && this->tasks.empty()) return;
                    
                    task = std::move(this->tasks.front());
                    this->tasks.pop();
                }
                task();
            }
        });
    }
}

template<class F, class... Args>
auto ThreadPool::enqueue(F&& f, Args&&... args) 
    -> std::future<typename std::result_of<F(Args...)>::type> {
    
    using return_type = typename std::result_of<F(Args...)>::type;
    auto task = std::make_shared<std::packaged_task<return_type()>>(
        std::bind(std::forward<F>(f), std::forward<Args>(args)...)
    );
    
    std::future<return_type> res = task->get_future();
    {
        std::unique_lock<std::mutex> lock(queue_mutex);
        if (stop) throw std::runtime_error("enqueue on stopped ThreadPool");
        tasks.emplace([task]() { (*task)(); });
    }
    condition.notify_one();
    return res;
}

ThreadPool::~ThreadPool() {
    {
        std::unique_lock<std::mutex> lock(queue_mutex);
        stop = true;
    }
    condition.notify_all();
    for (std::thread &worker : workers) {
        worker.join();
    }
}
```

### 测试代码

```cpp
#include <iostream>
#include <vector>
#include <chrono>
#include "ThreadPool.h"

int main() {
    ThreadPool pool(4);
    std::vector<std::future<int>> results;

    for (int i = 0; i < 8; ++i) {
        results.emplace_back(pool.enqueue([i] {
            std::cout << "hello " << i << std::endl;
            std::this_thread::sleep_for(std::chrono::seconds(1));
            std::cout << "world " << i << std::endl;
            return i * i;
        }));
    }

    for (auto&& result : results) {
        std::cout << result.get() << ' ';
    }
    std::cout << std::endl;
    
    return 0;
}
```

### emplace_back 详解

`emplace_back` 是 C++11 引入的 `std::vector` 成员函数，用于在容器末尾直接构造元素，而不是先构造再拷贝或移动。

```cpp
std::vector<MyClass> vec;
vec.emplace_back(arg1, arg2, ...);  // 直接在vector内存中构造对象
```

#### 与 push_back 的比较

| 特性     | emplace_back                    | push_back                      |
| :------- | :------------------------------ | :----------------------------- |
| 参数     | 构造元素所需的参数              | 已构造的对象或临时对象         |
| 构造方式 | 直接在容器内存中构造            | 先构造对象，再移动或拷贝到容器 |
| 效率     | 通常更高(避免临时对象创建/移动) | 可能低效(需要构造+移动/拷贝)   |
| C++版本  | C++11引入                       | C++98就有                      |

```cpp
// 使用 push_back
Person temp("Alice", 30);
people.push_back(temp);          // 1次构造 + 1次拷贝构造
people.push_back(Person("Bob", 25)); // 1次构造 + 1次移动构造

// 使用 emplace_back
people.emplace_back("Charlie", 40); // 仅1次构造
```

### 复杂语法解析

```cpp
auto enqueue(F&& f, Args&&... args) 
        -> std::future<typename std::result_of<F(Args...)>::type>;

/*
使用 C++11 的尾置返回类型语法

实际返回类型是 std::future<typename std::result_of<F(Args...)>::type>

参数列表:

F&& f: 一个通用引用（forwarding reference）参数，可以接受任何可调用对象

Args&&... args: 可变参数的通用引用，可以接受任意数量和类型的参数

返回类型详解:

std::result_of<F(Args...)>::type:
使用 std::result_of 类型特征来推导调用 f 并传入 args... 的返回类型
在 C++17 中已弃用，建议使用 std::invoke_result_t 替代

std::future<...>:
将返回类型包装在 std::future 中，表示异步操作的结果
*/
```