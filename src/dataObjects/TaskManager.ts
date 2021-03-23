/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    DataObject,
    DataObjectFactory,
} from "@fluidframework/aqueduct";
import { IFluidHandle } from "@fluidframework/core-interfaces";
import { ITaskManager, TaskManager, ITaskManagerEvents } from "@fluid-experimental/task-manager";

export type ITaskManagerDataObject = Pick<ITaskManager, "lockTask" | "abandon" | "haveTaskLock" | "queued">

export class TaskManagerDataObject extends DataObject<object,undefined,ITaskManagerEvents> implements ITaskManagerDataObject {

    private _tm: TaskManager | undefined;

    private get taskManager() {
        if (!this._tm) {
            throw new Error("TaskManger DDS not initialized");
        }

        return this._tm;
    }

    public static readonly factory = new DataObjectFactory
        (
            // Note: factory types cannot have "/" or things break
            "task-manager",
            TaskManagerDataObject,
            [],
            {},
        );

    protected async initializingFirstTime() {
        const tm = TaskManager.create(this.runtime);
        this.root.set("tm", tm.handle);
    }

    protected async hasInitialized() {
        this._tm = await this.root.get<IFluidHandle<TaskManager>>("tm")?.get();
    }

    public lockTask(taskId: string): Promise<void> {
        return this.taskManager.lockTask(taskId);
    }

    public abandon(taskId: string): void {
        return this.taskManager.abandon(taskId);
    }
     
    public haveTaskLock(taskId: string): boolean {
        return this.taskManager.haveTaskLock(taskId);
    }
     
    public queued(taskId: string): boolean {
        return this.taskManager.queued(taskId);
    }
}
