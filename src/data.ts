const DB_NAME = 'timesheet';
const DB_VERSION = 1;

export interface Job {
  id: number;
  name: string;
  rate: number;
}

export interface Task {
  id: number;
  jobId: number;
  start: number;
  finish: number;
  comment: string;
}

/**
 * Handler for onupgradeneeded.  Create stores and indexes.
 * 
 * @param event object containing reference to db at target.result
 */
function handleUpgrade({target: {result: db}}: any) {
  db.createObjectStore('config', {keyPath: 'name'});

  db.createObjectStore('jobs', {keyPath: 'id', autoIncrement: true});

  const taskStore = db.createObjectStore('tasks', {keyPath: 'id', autoIncrement: true});
  taskStore.createIndex('jobId', 'jobId', {unique: false});
}

/**
 * Create job.
 * 
 * @param job to create
 * @returns job with id populated
 */
export function createJob(job: Job): Promise<Job> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);
  
    openDb.onupgradeneeded = handleUpgrade;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const create = db.transaction(['jobs'], 'readwrite')
        .objectStore('jobs')
        .add(job);
      
      create.onsuccess = ({target: {result: id}}: any) => {
        resolve({...job, id});
      };
  
      create.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

/**
 * Get all jobs.
 * 
 * @returns array of jobs
 */
export function getJobs(): Promise<Job[]> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);
  
    openDb.onupgradeneeded = handleUpgrade;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const getAll = db.transaction(['jobs'], 'readonly')
        .objectStore('jobs')
        .getAll();
      
      getAll.onsuccess = ({target: {result: jobs}}: any) => {
        resolve(jobs);
      };
  
      getAll.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

/**
 * Get job by id.
 * 
 * @param id of job
 * @returns job
 */
export function getJob(id: number): Promise<Job> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);
  
    openDb.onupgradeneeded = handleUpgrade;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const getJob = db.transaction(['jobs'], 'readonly')
        .objectStore('jobs')
        .get(id);
      
      getJob.onsuccess = ({target: {result: job}}: any) => {
        resolve(job);
      };
  
      getJob.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

/**
 * Get tasks by job id.
 * 
 * @param jobId of tasks
 * @returns tasks with jobId
 */
export function getTasks(jobId: number): Promise<Task[]> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);
  
    openDb.onupgradeneeded = handleUpgrade;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const openCursor = db.transaction(['tasks'], 'readonly')
        .objectStore('tasks')
        .index('jobId')
        .openCursor(IDBKeyRange.only(jobId));

      const tasks: Task[] = [];

      openCursor.onsuccess = ({target: {result: cursor}}: any) => {
        if (cursor) {
          tasks.push(cursor.value);
          cursor.continue();
        } else {
          resolve(tasks);
        }
      }
  
      openCursor.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

/**
 * Get current job id.
 * 
 * @returns current job id
 */
export function getCurrentJobId(): Promise<number> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);
  
    openDb.onupgradeneeded = handleUpgrade;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const req = db.transaction(['config'], 'readonly')
        .objectStore('config')
        .get('currentJobId');

      req.onsuccess = ({target: {result}}: any) => {
        resolve(result ? result.value : null);
      }

      req.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

/**
 * Set current job id and stop unfinished task if it does not belong to current job.
 * 
 * @param id new current job id
 * @returns current job id
 */
export function setCurrentJobId(id: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);
  
    openDb.onupgradeneeded = handleUpgrade;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const tx = db.transaction(['config', 'tasks'], 'readwrite');
      const configStore = tx.objectStore('config');
      const taskStore = tx.objectStore('tasks');

      const update = configStore.put({name: 'currentJobId', value: id});
      
      update.onsuccess = () => {
        const getTasks = taskStore.getAll();

        getTasks.onsuccess = ({target: {result: tasks}}: any) => {
          const unfinishedTask = tasks.find((t: Task) => t.jobId !== id && !t.finish);
          if (unfinishedTask) {
            const stopTask = taskStore.put({...unfinishedTask, finish: Date.now()});

            stopTask.onsuccess = () => {
              resolve(id);
            }
          } else {
            resolve(id);
          }
        }
      };
  
      tx.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

/**
 * Update job.
 * 
 * @param job updated job
 * @returns updated job
 */
export function updateJob(job: Job): Promise<Job> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);
  
    openDb.onupgradeneeded = handleUpgrade;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const update = db.transaction(['jobs'], 'readwrite')
        .objectStore('jobs')
        .put(job);
      
      update.onsuccess = () => {
        resolve(job);
      };
  
      update.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

/**
 * Update task.
 * 
 * @param task updated task
 * @returns updated task
 */
export function updateTask(task: Task): Promise<Task> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);
  
    openDb.onupgradeneeded = handleUpgrade;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const update = db.transaction(['tasks'], 'readwrite')
        .objectStore('tasks')
        .put(task);
      
      update.onsuccess = () => {
        resolve(task);
      };
  
      update.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

/**
 * Delete job and clear currentJobId if job was current.
 * 
 * @param id job to delete
 * @returns id of deleted job
 */
export function deleteJob(id: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);

    openDb.onupgradeneeded = handleUpgrade;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const tx = db.transaction(['config', 'jobs'], 'readwrite');
      const configStore = tx.objectStore('config');
      const jobStore = tx.objectStore('jobs');

      const removeJob = jobStore.delete(id);
      
      removeJob.onsuccess = () => {
        const getCurrentJobId = configStore.get('currentJobId');

        getCurrentJobId.onsuccess = ({target: {result}}: any) => {
          if (result?.value === id) {
            const clearCurrentJobId = configStore.put({name: 'currentJobId', value: null});

            clearCurrentJobId.onsuccess = () => {
              resolve(id);
            }
          } else {
            resolve(id);
          }
        }
      };
  
      tx.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

/**
 * Delete task by id.
 * 
 * @param id of task to delete
 * @returns id of deleted task
 */
export function deleteTask(id: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);

    openDb.onupgradeneeded = handleUpgrade;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const remove = db.transaction(['tasks'], 'readwrite')
        .objectStore('tasks')
        .delete(id);
      
      remove.onsuccess = () => {
        resolve(id);
      };

      remove.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

/**
 * Stop unfinished task or create new one.
 * 
 * @returns stopped or created task
 */
export function punch(): Promise<Task> {
  return new Promise((resolve, reject) => {
    const openDb = indexedDB.open(DB_NAME, DB_VERSION);
  
    openDb.onupgradeneeded = handleUpgrade;
  
    openDb.onerror = ({target: error}) => {
      reject(error);
    };
  
    openDb.onsuccess = ({target: {result: db}}: any) => {
      const tx = db.transaction(['config', 'tasks'], 'readwrite');
      const configStore = tx.objectStore('config');
      const taskStore = tx.objectStore('tasks');

      const getCurrentJobId = configStore.get('currentJobId');

      getCurrentJobId.onsuccess = ({target: {result}}: any) => {
        if (result?.value) {
          const {value: currentJobId} = result;

          const getTasks = taskStore
            .index('jobId')
            .openCursor(IDBKeyRange.only(currentJobId));

          const tasks: Task[] = [];

          getTasks.onsuccess = ({target: {result: cursor}}: any) => {
            if (cursor) {
              tasks.push(cursor.value);
              cursor.continue();
            } else {
              const unfinishedTask = tasks.find(({finish}) => !finish);
  
              if (unfinishedTask) {
                const finishedTask = {...unfinishedTask, finish: Date.now()};

                const update = taskStore.put(finishedTask);
  
                update.onsuccess = () => {
                  resolve(finishedTask);
                }
              } else {
                const newTask: any = {jobId: currentJobId, start: Date.now(), finish: null};

                const create = taskStore.add(newTask);
  
                create.onsuccess = ({target: {result: id}}: any) => {
                  resolve({...newTask, id});
                }
              }
            }
          };
        } else {
          reject(Error('No current job'));
        }
      }
  
      tx.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}
