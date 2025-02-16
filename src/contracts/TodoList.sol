// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

contract TodoList {
    struct Task {
        uint32 id;
        string task;
        bool completed;
    }

    struct UserTasks {
        uint32 taskCount;
        mapping(uint32 => Task) tasks;
    }

    mapping(address => UserTasks) private userTasks;

    event TaskCreated(address user, uint32 id, string task, bool completed);
    event TaskCompleted(address user, uint32 id, bool completed);
    event TaskUpdated(address user, uint32 id, string task);
    event TaskRemoved(address user, uint32 id);

    function getTasks() external view returns (Task[] memory) {
        UserTasks storage userTaskList = userTasks[msg.sender];
        Task[] memory taskList = new Task[](userTaskList.taskCount);
        for (uint32 i = 0; i < userTaskList.taskCount; i++) {
            taskList[i] = userTaskList.tasks[i];
        }
        return taskList;
    }

    function getTask(uint32 _id) external view returns (Task memory) {
        return userTasks[msg.sender].tasks[_id];
    }

    function createTask(string memory _task) external {
        UserTasks storage userTaskList = userTasks[msg.sender];
        userTaskList.tasks[userTaskList.taskCount] = Task({
            id: userTaskList.taskCount,
            task: _task,
            completed: false
        });
        userTaskList.taskCount++;
        emit TaskCreated(msg.sender, userTaskList.taskCount, _task, false);
    }

    function updateTask(uint32 _id, string memory _task) external {
        UserTasks storage userTaskList = userTasks[msg.sender];
        require(_id <= userTaskList.taskCount, "Task does not exist");
        userTaskList.tasks[_id].task = _task;
        emit TaskUpdated(msg.sender, _id, _task);
    }

    function removeTask(uint32 _id) external {
        UserTasks storage userTaskList = userTasks[msg.sender];
        require(_id <= userTaskList.taskCount, "Task does not exist");
        delete userTaskList.tasks[_id];
        userTaskList.taskCount--;
        emit TaskRemoved(msg.sender, _id);
    }

    function completeTask(uint32 _id) external {
        UserTasks storage userTaskList = userTasks[msg.sender];
        require(_id <= userTaskList.taskCount, "Task does not exist");
        userTaskList.tasks[_id].completed = true;
        emit TaskCompleted(msg.sender, _id, true);
    }
}