# NSL-KDD Dataset Analysis

This document provides a detailed overview of the NSL-KDD dataset used for training and evaluating the Machine Learning Intrusion Detection System (IDS).

## Dataset Source

The **NSL-KDD** dataset is a refined version of the classic KDD Cup 1999 dataset. It was developed by the University of New Brunswick (UNB) to solve several inherent issues in KDD'99:
1. **No Redundant Records**: It removes redundant records in the training set so classifiers do not produce biased results towards frequent patterns.
2. **No Duplicate Records**: It eliminates duplicate records in the test set, improving prediction accuracy assessment on rare occurrences.
3. **Proportional Representation**: The number of selected records from each difficulty group is inversely proportional to the percentage of records in the original KDD dataset.

- **Primary Repository**: Hosted by the [University of New Brunswick Cybersecurity Data Repository](https://www.unb.ca/cic/datasets/nsl.html).

---

## Feature Overview

Each traffic record contains **41 traffic features** plus a **class label** and a **difficulty score** (totaling 43 raw columns):

1. **Basic Features**: Individual connection features extracted from the IP/TCP header (e.g., `duration`, `protocol_type`, `service`, `flag`, `src_bytes`, `dst_bytes`, `land`, `wrong_fragment`, `urgent`).
2. **Content Features**: Features suggested by domain knowledge to detect security threats inside payload data (e.g., `hot`, `num_failed_logins`, `logged_in`, `num_compromised`, `root_shell`, `su_attempted`, `num_root`, `num_file_creations`, `num_shells`, `num_access_files`, `num_outbound_cmds`, `is_host_login`, `is_guest_login`).
3. **Time-based Traffic Features**: Features computed using a 2-second sliding window looking back from the current connection (e.g., `count`, `srv_count`, `serror_rate`, `srv_serror_rate`, `rerror_rate`, `srv_rerror_rate`, `same_srv_rate`, `diff_srv_rate`, `srv_diff_host_rate`).
4. **Host-based Traffic Features**: Features designed to capture slow probing attacks spanning longer than 2 seconds, computed using a historical window of 100 connections (e.g., `dst_host_count`, `dst_host_srv_count`, `dst_host_same_srv_rate`, `dst_host_diff_srv_rate`, `dst_host_same_src_port_rate`, `dst_host_srv_diff_host_rate`, `dst_host_serror_rate`, `dst_host_srv_serror_rate`, `dst_host_rerror_rate`, `dst_host_srv_rerror_rate`).

---

## Attack Categories

The specific attack labels (39 distinct types across train and test sets) are grouped into 4 high-level attack categories and a `normal` class:

| Category | Description | Common Intrusions / Attack Types |
| :--- | :--- | :--- |
| **DoS** | Denial of Service (resource exhaustion) | `neptune`, `smurf`, `back`, `teardrop`, `pod`, `land`, `mailbomb`, `apache2`, `processtable`, `udpstorm`, `worm` |
| **Probe** | Scanning and network surveillance | `satan`, `ipsweep`, `portsweep`, `nmap`, `mscan`, `saint` |
| **R2L** | Remote-to-Local unauthorized access | `warezclient`, `guess_passwd`, `warezmaster`, `ftp_write`, `multihop`, `phf`, `spy`, `sendmail`, `named`, `snmpgetattack`, `snmpguess`, `xlock`, `xsnoop`, `httptunnel` |
| **U2R** | User-to-Root privilege escalation | `buffer_overflow`, `loadmodule`, `rootkit`, `perl`, `ps`, `sqlattack`, `xterm` |
| **normal** | Benign administrative/user traffic | `normal` |

---

## Class Distribution and Imbalance

The distribution of the traffic classes in both training (`KDDTrain+`) and testing (`KDDTest+`) sets shows a severe class imbalance:

### Distribution Statistics

| Traffic Class | Train Count | Train % | Test Count | Test % |
| :--- | :--- | :--- | :--- | :--- |
| **normal** | 67,343 | 53.46% | 9,711 | 43.08% |
| **DoS** | 45,927 | 36.46% | 7,460 | 33.09% |
| **Probe** | 11,656 | 9.25% | 2,421 | 10.74% |
| **R2L** | 995 | 0.79% | 2,885 | 12.80% |
| **U2R** | 52 | 0.04% | 67 | 0.30% |
| **Total** | **125,973** | **100.0%** | **22,544** | **100.0%** |

### Imbalance Observations
- **Dominant Classes**: `normal` and `DoS` represent **89.92%** of the training dataset.
- **Sparse Classes**: `R2L` (0.79%) and `U2R` (0.04%) are extremely sparse in the training dataset. Standard machine learning algorithms will tend to ignore them without handling the imbalance.
- **Dataset Drift**: The test dataset contains a significantly higher proportion of R2L attacks (**12.80%**) compared to the training set (**0.79%**). Additionally, the test set includes novel attack types not present in the training set, which serves as a realistic challenge for model generalization.

---

## Key Findings & Preprocessing Recommendations

1. **Zero Variance Features**: The feature `num_outbound_cmds` has standard deviation `0.0` in both datasets (all records have value `0`). It should be dropped during feature selection.
2. **Highly Skewed Features**: Features like `duration`, `src_bytes`, and `dst_bytes` exhibit extreme right-skewness (standard deviation is orders of magnitude larger than the median/mean). Using log-scaling ($\log(x + 1)$) or robust scaling is essential before modeling.
3. **High Collinearity**:
   - There is an extremely high correlation between serror rates (e.g., `serror_rate` and `srv_serror_rate` have $r > 0.99$).
   - Similarly, host-based serror rates (`dst_host_serror_rate` and `dst_host_srv_serror_rate`) are highly correlated with time-based serror rates.
   - Using L1/L2 regularization or dimensionality reduction (PCA) will prevent numerical instability and overfitting.
4. **Clean Data Quality**: There are 0 missing values and 0 duplicate records in both the training and test sets.

---

## Visualization Artifacts

The generated visualizations are stored under `docs/images/`:
- **Class Distribution**: [attack_class_distribution.png](images/attack_class_distribution.png)
- **Numerical Feature Histograms**: [numerical_histograms.png](images/numerical_histograms.png)
- **Correlation Heatmap**: [correlation_heatmap.png](images/correlation_heatmap.png)
