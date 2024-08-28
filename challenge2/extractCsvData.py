import csv
from typing import List, Dict

def extractCsvData(csvFilePath: str) -> List[Dict[str, str]]:
    result: List[Dict[str, str]] = []
    with open(csvFilePath, mode='r', encoding='utf-8') as csvFile:
        csvRader = csv.DictReader(csvFile)
        for row in csvRader:
            result.append(row)
    
    return result