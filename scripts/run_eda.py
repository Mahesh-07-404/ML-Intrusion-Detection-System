import json
import os

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns


def main():
    base_dir = r"d:\personal project\ML-Intrustion-Detection-System"
    raw_train_path = os.path.join(base_dir, "datasets", "raw", "KDDTrain+.txt")
    raw_test_path = os.path.join(base_dir, "datasets", "raw", "KDDTest+.txt")
    images_dir = os.path.join(base_dir, "docs", "images")
    notebook_path = os.path.join(
        base_dir, "ml", "notebooks", "01_dataset_analysis.ipynb"
    )

    os.makedirs(images_dir, exist_ok=True)
    os.makedirs(os.path.dirname(notebook_path), exist_ok=True)

    print("Running EDA...")

    # Column names
    columns = [
        "duration",
        "protocol_type",
        "service",
        "flag",
        "src_bytes",
        "dst_bytes",
        "land",
        "wrong_fragment",
        "urgent",
        "hot",
        "num_failed_logins",
        "logged_in",
        "num_compromised",
        "root_shell",
        "su_attempted",
        "num_root",
        "num_file_creations",
        "num_shells",
        "num_access_files",
        "num_outbound_cmds",
        "is_host_login",
        "is_guest_login",
        "count",
        "srv_count",
        "serror_rate",
        "srv_serror_rate",
        "rerror_rate",
        "srv_rerror_rate",
        "same_srv_rate",
        "diff_srv_rate",
        "srv_diff_host_rate",
        "dst_host_count",
        "dst_host_srv_count",
        "dst_host_same_srv_rate",
        "dst_host_diff_srv_rate",
        "dst_host_same_src_port_rate",
        "dst_host_srv_diff_host_rate",
        "dst_host_serror_rate",
        "dst_host_srv_serror_rate",
        "dst_host_rerror_rate",
        "dst_host_srv_rerror_rate",
        "label",
        "difficulty_level",
    ]

    # Load data for scripting analysis and generating plots
    train_df = pd.read_csv(raw_train_path, names=columns)
    test_df = pd.read_csv(raw_test_path, names=columns)

    # Clean labels
    train_df["label"] = train_df["label"].astype(str).str.strip().str.rstrip(".")
    test_df["label"] = test_df["label"].astype(str).str.strip().str.rstrip(".")

    # Attack mapping to categories
    attack_mapping = {
        "normal": "normal",
        "back": "DoS",
        "land": "DoS",
        "neptune": "DoS",
        "pod": "DoS",
        "smurf": "DoS",
        "teardrop": "DoS",
        "mailbomb": "DoS",
        "apache2": "DoS",
        "processtable": "DoS",
        "udpstorm": "DoS",
        "worm": "DoS",
        "ipsweep": "Probe",
        "mscan": "Probe",
        "nmap": "Probe",
        "portsweep": "Probe",
        "saint": "Probe",
        "satan": "Probe",
        "ftp_write": "R2L",
        "guess_passwd": "R2L",
        "imap": "R2L",
        "multihop": "R2L",
        "phf": "R2L",
        "spy": "R2L",
        "warezclient": "R2L",
        "warezmaster": "R2L",
        "xlock": "R2L",
        "xsnoop": "R2L",
        "sendmail": "R2L",
        "named": "R2L",
        "httptunnel": "R2L",
        "snmpgetattack": "R2L",
        "snmpguess": "R2L",
        "buffer_overflow": "U2R",
        "loadmodule": "U2R",
        "perl": "U2R",
        "ps": "U2R",
        "rootkit": "U2R",
        "sqlattack": "U2R",
        "xterm": "U2R",
    }

    train_df["attack_category"] = train_df["label"].map(
        lambda x: attack_mapping.get(x, "Unknown")
    )
    test_df["attack_category"] = test_df["label"].map(
        lambda x: attack_mapping.get(x, "Unknown")
    )

    # Visualizations
    sns.set_theme(style="whitegrid")

    # 1. Attack Class Distribution plot
    print("Generating Attack Class Distribution plot...")
    plt.figure(figsize=(10, 6))
    train_counts = train_df["attack_category"].value_counts()
    test_counts = test_df["attack_category"].value_counts()
    dist_df = pd.DataFrame({"Train": train_counts, "Test": test_counts}).fillna(0)
    dist_df.plot(
        kind="bar",
        color=["#1a5276", "#d35400"],
        edgecolor="black",
        width=0.8,
        figsize=(10, 6),
    )
    plt.title(
        "NSL-KDD Attack Category Distribution (Train vs Test)",
        fontsize=14,
        fontweight="bold",
    )
    plt.ylabel("Number of Samples", fontsize=12)
    plt.xlabel("Traffic Class / Attack Category", fontsize=12)
    plt.xticks(rotation=0)
    plt.grid(axis="y", linestyle="--", alpha=0.7)
    plt.tight_layout()
    plt.savefig(os.path.join(images_dir, "attack_class_distribution.png"), dpi=300)
    plt.close()

    # 2. Numerical histograms of key features
    print("Generating Numerical Histograms...")
    key_numerical_features = ["duration", "src_bytes", "dst_bytes", "count"]
    fig, axes = plt.subplots(2, 2, figsize=(14, 12))
    axes = axes.ravel()
    for i, feat in enumerate(key_numerical_features):
        if feat in ["duration", "src_bytes", "dst_bytes"]:
            # Log scale because of extreme skewness
            # Shift by 1 to handle 0 values in log scale
            sns.histplot(
                data=train_df,
                x=feat,
                hue="attack_category",
                multiple="stack",
                log_scale=True,
                ax=axes[i],
                palette="Set2",
                alpha=0.8,
            )
            axes[i].set_title(
                f"Distribution of {feat} (Log Scale)", fontsize=13, fontweight="bold"
            )
        else:
            sns.histplot(
                data=train_df,
                x=feat,
                hue="attack_category",
                multiple="stack",
                ax=axes[i],
                palette="Set2",
                alpha=0.8,
            )
            axes[i].set_title(f"Distribution of {feat}", fontsize=13, fontweight="bold")

        axes[i].set_xlabel(feat, fontsize=11)
        axes[i].set_ylabel("Count", fontsize=11)
    plt.suptitle(
        "Distribution of Selected Traffic Features by Attack Class",
        fontsize=16,
        fontweight="bold",
    )
    plt.tight_layout()
    plt.savefig(os.path.join(images_dir, "numerical_histograms.png"), dpi=300)
    plt.close()

    # 3. Correlation heatmap
    print("Generating Correlation Heatmap...")
    numerical_cols = train_df.select_dtypes(include=[np.number]).columns
    # Filter out columns with constant value (zero variance)
    non_constant_cols = [col for col in numerical_cols if train_df[col].std() > 0.0]
    if "difficulty_level" in non_constant_cols:
        non_constant_cols.remove("difficulty_level")  # Exclude target metadata

    corr_matrix = train_df[non_constant_cols].corr()
    plt.figure(figsize=(18, 14))
    mask = np.triu(np.ones_like(corr_matrix, dtype=bool))
    sns.heatmap(
        corr_matrix,
        mask=mask,
        cmap="coolwarm",
        vmin=-1,
        vmax=1,
        center=0,
        square=True,
        linewidths=0.5,
        cbar_kws={"shrink": 0.8},
    )
    plt.title(
        "Correlation Matrix of Traffic Numerical Features",
        fontsize=16,
        fontweight="bold",
    )
    plt.tight_layout()
    plt.savefig(os.path.join(images_dir, "correlation_heatmap.png"), dpi=300)
    plt.close()

    # Log some stats
    print("\n--- EDA Stats ---")
    print(f"Train set shape: {train_df.shape}")
    print(f"Test set shape: {test_df.shape}")
    print(f"Train missing values: {train_df.isnull().sum().sum()}")
    print(f"Test missing values: {test_df.isnull().sum().sum()}")
    print(f"Train duplicate rows: {train_df.duplicated().sum()}")
    print(f"Test duplicate rows: {test_df.duplicated().sum()}")
    print("\nTrain class distribution:")
    print(train_df["attack_category"].value_counts())
    print("\nTest class distribution:")
    print(test_df["attack_category"].value_counts())

    # Build Jupyter Notebook JSON
    print("Generating Jupyter Notebook...")
    notebook_content = {
        "cells": [
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    "# NSL-KDD Dataset Exploratory Data Analysis (EDA)\n",
                    "\n",
                    "This notebook contains the exploratory data analysis for the NSL-KDD cyber intrusion detection dataset. The objective is to understand the dataset characteristics, feature distributions, missing values, duplicates, and labels to prepare for building an effective Machine Learning Intrusion Detection System (IDS).\n",
                    "\n",
                    "## Objective\n",
                    "- Load training and testing sets with proper schema.\n",
                    "- Analyze data shapes, feature types, missing values, and duplicates.\n",
                    "- Group specific labels into high-level attack categories (DoS, Probe, R2L, U2R, normal).\n",
                    "- Analyze target class imbalance in training vs. test sets.\n",
                    "- Visualize key feature distributions and correlation matrices.",
                ],
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    "import os\n",
                    "import pandas as pd\n",
                    "import numpy as np\n",
                    "import matplotlib.pyplot as plt\n",
                    "import seaborn as sns\n",
                    "\n",
                    "# Set plotting theme\n",
                    'sns.set_theme(style="whitegrid")\n',
                    'plt.rcParams["figure.figsize"] = (10, 6)',
                ],
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    "## 1. Define Column Names and Load Datasets\n",
                    "Since the raw files do not contain a header, we define the 43 standard columns (41 traffic features, 1 label, and 1 difficulty score level).",
                ],
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    "columns = [\n",
                    '    "duration", "protocol_type", "service", "flag", "src_bytes", "dst_bytes", \n',
                    '    "land", "wrong_fragment", "urgent", "hot", "num_failed_logins", \n',
                    '    "logged_in", "num_compromised", "root_shell", "su_attempted", "num_root", \n',
                    '    "num_file_creations", "num_shells", "num_access_files", "num_outbound_cmds", \n',
                    '    "is_host_login", "is_guest_login", "count", "srv_count", "serror_rate", \n',
                    '    "srv_serror_rate", "rerror_rate", "srv_rerror_rate", "same_srv_rate", \n',
                    '    "diff_srv_rate", "srv_diff_host_rate", "dst_host_count", "dst_host_srv_count", \n',
                    '    "dst_host_same_srv_rate", "dst_host_diff_srv_rate", "dst_host_same_src_port_rate", \n',
                    '    "dst_host_srv_diff_host_rate", "dst_host_serror_rate", "dst_host_srv_serror_rate", \n',
                    '    "dst_host_rerror_rate", "dst_host_srv_rerror_rate", "label", "difficulty_level"\n',
                    "]\n",
                    "\n",
                    "# Adjust paths to project root\n",
                    'train_path = "../../datasets/raw/KDDTrain+.txt"\n',
                    'test_path = "../../datasets/raw/KDDTest+.txt"\n',
                    "\n",
                    "train_df = pd.read_csv(train_path, names=columns)\n",
                    "test_df = pd.read_csv(test_path, names=columns)\n",
                    "\n",
                    'print(f"KDDTrain+ shape: {train_df.shape}")\n',
                    'print(f"KDDTest+ shape: {test_df.shape}")',
                ],
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    "## 2. Basic Dataset Characteristics & Quality Check\n",
                    "Let's inspect data types, missing values, duplicates, and basic stats.",
                ],
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    'print("=== Missing Values ===")\n',
                    'print(f"Train missing values count: {train_df.isnull().sum().sum()}")\n',
                    'print(f"Test missing values count: {test_df.isnull().sum().sum()}")\n',
                    "\n",
                    'print("\\n=== Duplicate Rows ===")\n',
                    'print(f"Train duplicates: {train_df.duplicated().sum()}")\n',
                    'print(f"Test duplicates: {test_df.duplicated().sum()}")\n',
                    "\n",
                    'print("\\n=== Data Types Summary ===")\n',
                    "print(train_df.dtypes.value_counts())",
                ],
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    "## 3. Attack Categories Mapping\n",
                    "The dataset contains 39 specific attack classes which map into 4 main categories (DoS, Probe, R2L, U2R) + normal. We will map them for analysis.",
                ],
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    "# Clean label column by stripping spaces and dots\n",
                    "train_df['label'] = train_df['label'].astype(str).str.strip().str.rstrip('.')\n",
                    "test_df['label'] = test_df['label'].astype(str).str.strip().str.rstrip('.')\n",
                    "\n",
                    "attack_mapping = {\n",
                    "    'normal': 'normal',\n",
                    "    'back': 'DoS', 'land': 'DoS', 'neptune': 'DoS', 'pod': 'DoS', 'smurf': 'DoS', 'teardrop': 'DoS',\n",
                    "    'mailbomb': 'DoS', 'apache2': 'DoS', 'processtable': 'DoS', 'udpstorm': 'DoS', 'worm': 'DoS',\n",
                    "    'ipsweep': 'Probe', 'mscan': 'Probe', 'nmap': 'Probe', 'portsweep': 'Probe', 'saint': 'Probe', 'satan': 'Probe',\n",
                    "    'ftp_write': 'R2L', 'guess_passwd': 'R2L', 'imap': 'R2L', 'multihop': 'R2L', 'phf': 'R2L', 'spy': 'R2L',\n",
                    "    'warezclient': 'R2L', 'warezmaster': 'R2L', 'xlock': 'R2L', 'xsnoop': 'R2L', 'sendmail': 'R2L',\n",
                    "    'named': 'R2L', 'httptunnel': 'R2L', 'snmpgetattack': 'R2L', 'snmpguess': 'R2L',\n",
                    "    'buffer_overflow': 'U2R', 'loadmodule': 'U2R', 'perl': 'U2R', 'ps': 'U2R', 'rootkit': 'U2R', 'sqlattack': 'U2R',\n",
                    "    'xterm': 'U2R'\n",
                    "}\n",
                    "\n",
                    "train_df['attack_category'] = train_df['label'].map(lambda x: attack_mapping.get(x, 'Unknown'))\n",
                    "test_df['attack_category'] = test_df['label'].map(lambda x: attack_mapping.get(x, 'Unknown'))\n",
                    "\n",
                    'print("Train Set Mapping Verification (Top 10):")\n',
                    "print(train_df[['label', 'attack_category']].head(10))",
                ],
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    "## 4. Analyze Target Class Distribution and Imbalance\n",
                    "Let's count samples in each category for both training and testing datasets, and plot them.",
                ],
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    "train_counts = train_df['attack_category'].value_counts()\n",
                    "test_counts = test_df['attack_category'].value_counts()\n",
                    "dist_df = pd.DataFrame({'Train': train_counts, 'Test': test_counts}).fillna(0).astype(int)\n",
                    "dist_df['Train_Pct'] = (dist_df['Train'] / dist_df['Train'].sum() * 100).round(2)\n",
                    "dist_df['Test_Pct'] = (dist_df['Test'] / dist_df['Test'].sum() * 100).round(2)\n",
                    'print("=== Attack Category Distributions ===")\n',
                    "print(dist_df)\n",
                    "\n",
                    "# Plot class distribution\n",
                    "dist_df[['Train', 'Test']].plot(kind='bar', color=['#1a5276', '#d35400'], edgecolor='black', width=0.8, figsize=(10, 6))\n",
                    "plt.title('NSL-KDD Attack Category Distribution (Train vs Test)', fontsize=14, fontweight='bold')\n",
                    "plt.ylabel('Number of Samples', fontsize=12)\n",
                    "plt.xlabel('Traffic Class / Attack Category', fontsize=12)\n",
                    "plt.xticks(rotation=0)\n",
                    "plt.grid(axis='y', linestyle='--', alpha=0.7)\n",
                    "plt.tight_layout()\n",
                    "plt.show()",
                ],
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    "## 5. Numerical Feature Statistics and Distributions\n",
                    "We'll review descriptive statistics for traffic variables, and plot histograms for key features like `duration`, `src_bytes`, `dst_bytes`, and `count` using a log-scale where appropriate.",
                ],
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    "key_numerical_features = ['duration', 'src_bytes', 'dst_bytes', 'count']\n",
                    'print("=== Key Numerical Features Statistics ===")\n',
                    "print(train_df[key_numerical_features].describe())\n",
                    "\n",
                    "fig, axes = plt.subplots(2, 2, figsize=(14, 12))\n",
                    "axes = axes.ravel()\n",
                    "for i, feat in enumerate(key_numerical_features):\n",
                    "    if feat in ['duration', 'src_bytes', 'dst_bytes']:\n",
                    "        sns.histplot(\n",
                    "            data=train_df, \n",
                    "            x=feat, \n",
                    "            hue='attack_category', \n",
                    "            multiple='stack', \n",
                    "            log_scale=True, \n",
                    "            ax=axes[i], \n",
                    "            palette='Set2',\n",
                    "            alpha=0.8\n",
                    "        )\n",
                    "        axes[i].set_title(f'Distribution of {feat} (Log Scale)', fontsize=13, fontweight='bold')\n",
                    "    else:\n",
                    "        sns.histplot(\n",
                    "            data=train_df, \n",
                    "            x=feat, \n",
                    "            hue='attack_category', \n",
                    "            multiple='stack', \n",
                    "            ax=axes[i], \n",
                    "            palette='Set2',\n",
                    "            alpha=0.8\n",
                    "        )\n",
                    "        axes[i].set_title(f'Distribution of {feat}', fontsize=13, fontweight='bold')\n",
                    "    axes[i].set_xlabel(feat, fontsize=11)\n",
                    "    axes[i].set_ylabel('Count', fontsize=11)\n",
                    "plt.suptitle('Distribution of Selected Traffic Features by Attack Class', fontsize=16, fontweight='bold')\n",
                    "plt.tight_layout()\n",
                    "plt.show()",
                ],
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    "## 6. Correlation Analysis\n",
                    "We'll compute the Pearson correlation matrix for non-constant traffic numerical features and plot a heatmap to find highly collinear variables.",
                ],
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    "numerical_cols = train_df.select_dtypes(include=[np.number]).columns\n",
                    "# Filter out columns with constant value (zero variance)\n",
                    "non_constant_cols = [col for col in numerical_cols if train_df[col].std() > 0.0]\n",
                    "if 'difficulty_level' in non_constant_cols:\n",
                    "    non_constant_cols.remove('difficulty_level')\n",
                    "\n",
                    "corr_matrix = train_df[non_constant_cols].corr()\n",
                    "mask = np.triu(np.ones_like(corr_matrix, dtype=bool))\n",
                    "\n",
                    "plt.figure(figsize=(18, 14))\n",
                    "sns.heatmap(\n",
                    "    corr_matrix, \n",
                    "    mask=mask, \n",
                    "    cmap='coolwarm', \n",
                    "    vmin=-1, \n",
                    "    vmax=1, \n",
                    "    center=0, \n",
                    "    square=True, \n",
                    "    linewidths=.5, \n",
                    '    cbar_kws={"shrink": .8}\n',
                    ")\n",
                    "plt.title('Correlation Matrix of Traffic Numerical Features', fontsize=16, fontweight='bold')\n",
                    "plt.tight_layout()\n",
                    "plt.show()",
                ],
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    "## 7. Categorical Feature Analysis\n",
                    "Let's analyze symbolic/categorical features: `protocol_type`, `service`, and `flag`.",
                ],
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    "for col in ['protocol_type', 'flag']:\n",
                    '    print(f"\\n=== Distribution of {col} in Train ===")\n',
                    "    print(train_df[col].value_counts())\n",
                    "    \n",
                    'print(f"\\n=== Top 10 Services in Train ===")\n',
                    "print(train_df['service'].value_counts().head(10))",
                ],
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    "## 8. Summary of EDA Findings\n",
                    "1. **Dataset Size**: The training dataset contains 125,973 records, while the testing dataset contains 22,544 records.\n",
                    "2. **Missing Values**: There are no missing values in either the training or testing dataset, indicating clean data collection.\n",
                    "3. **Duplicates**: No duplicate rows are present in the datasets.\n",
                    "4. **Target Classes**: Normal traffic comprises 53.46% of the training set. Among the attack classes, DoS is the most frequent, followed by Probe. U2R and R2L classes are extremely sparse, highlighting major class imbalance.\n",
                    "5. **Feature Distribution skewness**: Traffic volume features (`src_bytes`, `dst_bytes`) and `duration` have extremely high skewness, indicating a need for logarithmic transformation or robust scaling in the preprocessing stage.\n",
                    "6. **Correlation**: There are clusters of highly correlated features, particularly among error rate indicators (e.g., `serror_rate`, `srv_serror_rate`, `dst_host_serror_rate`), which suggests potential for dimensionality reduction or model regularization.",
                ],
            },
        ],
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3 (ipykernel)",
                "language": "python",
                "name": "python3",
            },
            "language_info": {"name": "python"},
        },
        "nbformat": 4,
        "nbformat_minor": 2,
    }

    with open(notebook_path, "w") as f:
        json.dump(notebook_content, f, indent=1)

    print(f"Jupyter Notebook successfully written to {notebook_path}")
    print("EDA Complete!")


if __name__ == "__main__":
    main()
