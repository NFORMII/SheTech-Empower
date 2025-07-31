import os

EXCLUDE_DIRS = {'__pycache__', 'migrations', '.git', 'env', 'venv', '.venv'}
EXCLUDE_EXTENSIONS = {'.zip'}
OUTPUT_FILE = 'src.txt'

def list_files_to_txt(base_dir='.', output_file=OUTPUT_FILE):
    with open(output_file, 'w', encoding='utf-8') as f:
        for root, dirs, files in os.walk(base_dir):
            # Exclude unwanted directories
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
            for file in files:
                # Skip hidden files, .zip files, and the output file
                if (file.startswith('.') or 
                    os.path.splitext(file)[1] in EXCLUDE_EXTENSIONS or 
                    file == output_file):
                    continue
                full_path = os.path.join(root, file)
                relative_path = os.path.relpath(full_path, base_dir)
                f.write(relative_path + '\n')

list_files_to_txt()
