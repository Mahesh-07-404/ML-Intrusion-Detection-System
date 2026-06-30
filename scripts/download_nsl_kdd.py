import os
import urllib.request

def download_file(url, dest_path):
    print(f"Downloading {url} to {dest_path}...")
    try:
        urllib.request.urlretrieve(url, dest_path)
        print(f"Successfully downloaded {dest_path}")
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        raise e

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    raw_dir = os.path.join(base_dir, "datasets", "raw")
    os.makedirs(raw_dir, exist_ok=True)

    # Standard NSL-KDD download URLs
    urls = {
        "KDDTrain+.txt": "https://raw.githubusercontent.com/defcom17/NSL_KDD/master/KDDTrain%2B.txt",
        "KDDTest+.txt": "https://raw.githubusercontent.com/defcom17/NSL_KDD/master/KDDTest%2B.txt"
    }

    for filename, url in urls.items():
        dest = os.path.join(raw_dir, filename)
        if not os.path.exists(dest):
            download_file(url, dest)
        else:
            print(f"File {filename} already exists at {dest}, skipping download.")

if __name__ == "__main__":
    main()
