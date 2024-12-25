import tkinter as tk
from tkinter import scrolledtext
import subprocess
import threading

# Function to run a command in an external terminal
def run_command_in_terminal(command, cwd, log_widget, button):
    def task():
        try:
            # Open the command in an external terminal
            terminal_command = f'start cmd /k "cd /d {cwd} && {command}"'
            subprocess.Popen(terminal_command, shell=True)
            log_widget.insert(tk.END, f"Started: {command} in {cwd}\n")
            button.config(state=tk.DISABLED)
        except Exception as e:
            log_widget.insert(tk.END, f"ERROR: {str(e)}\n")
        log_widget.yview(tk.END)

    # Run the task in a new thread
    threading.Thread(target=task, daemon=True).start()

# Functions for starting each service
def start_frontend():
    run_command_in_terminal("npm start", "./nextgen_auction", log_widget, frontend_button)

def start_backend():
    run_command_in_terminal("node sseservers.js", "./backend", log_widget, backend_button)

def start_backend_dev():
    run_command_in_terminal("npm run dev", "./backend", log_widget, backend_dev_button)

def start_database_js():
    run_command_in_terminal("node servo.js", "./database", log_widget, database_js_button)

def start_database_py():
    run_command_in_terminal("python app.py", "./database", log_widget, database_py_button)

# Create the main Tkinter window
root = tk.Tk()
root.title("Launcher")
root.geometry("600x500")

# Buttons for each command
frontend_button = tk.Button(root, text="Start Frontend", command=start_frontend, width=20)
frontend_button.pack(pady=5)

backend_button = tk.Button(root, text="Start Backend (Node)", command=start_backend, width=30)
backend_button.pack(pady=5)

backend_dev_button = tk.Button(root, text="Start Backend (Dev)", command=start_backend_dev, width=30)
backend_dev_button.pack(pady=5)

database_js_button = tk.Button(root, text="Start Database (Node)", command=start_database_js, width=30)
database_js_button.pack(pady=5)

database_py_button = tk.Button(root, text="Start Database (Python)", command=start_database_py, width=30)
database_py_button.pack(pady=5)

# Log display
log_widget = scrolledtext.ScrolledText(root, wrap=tk.WORD, height=20, width=70)
log_widget.pack(pady=10)

# Start the Tkinter event loop
root.mainloop()
