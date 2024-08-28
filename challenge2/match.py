from extractCsvData import extractCsvData
from typing import List, Dict, Optional, Any

orderHeadersPath = './order_headers.csv'
orderLinesPath = './order_lines.csv'

# Backtracking is used to find solution
def findMatches(
    orderHeader: Dict[str, str],
    totalPrice: float,
    currentPrice: float,
    orderLines: List[Dict[str, str]],
    currentOrders: List[Dict[str, str]]
) -> Optional[Dict[str, Any]]:
    totalLines, currentLines = int(orderHeader["total_lines"]), len(currentOrders)
    if currentLines > totalLines:
        return None

    if currentLines == totalLines:
        currentPrice = round(currentPrice, 2)
        if totalPrice == currentPrice:
            return {
                "id": orderHeader["id"],
                "total_price": orderHeader["total_price"],
                "total_lines": orderHeader["total_lines"],
                "order_lines": currentOrders.copy()
            }

    for orderLine in orderLines:
        orderLinePrice = float(orderLine["price"])
        currentOrders.append(orderLine)
        match = findMatches(orderHeader, totalPrice, currentPrice + orderLinePrice, orderLines, currentOrders)
        currentOrders.pop()

        if match:
            return match
    
    return None

def matchOrderLinesWithHeaders() -> List[Optional[Dict[str, Any]]]:
    orderHeaders = extractCsvData(orderHeadersPath)
    orderLines = extractCsvData(orderLinesPath)

    matches = []
    for orderHeader in orderHeaders:
        match = findMatches(
            orderHeader,
            float(orderHeader['total_price']),
            0,
            orderLines,
            []
        )
        matches.append(match)
    
    return matches

print(matchOrderLinesWithHeaders())
