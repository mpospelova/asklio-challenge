from extractCsvData import extractCsvData
from typing import List, Dict, Optional, Any

orderHeadersPath = './order_headers.csv'
orderLinesPath = './order_lines.csv'

# Find Match for specific orderHeader
def findMatch(
    orderHeader,
    currentPrice,
    orderLines,
    currentOrders,
    usedOrderLines
):
    totalPrice = float(orderHeader['total_price'])
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

    for i in range(len(orderLines)):
        if i in currentOrders or i in usedOrderLines:
            continue

        orderLinePrice = float(orderLines[i]["price"])
        currentOrders.add(i)
        usedOrderLines.add(i)
        match = findMatch(orderHeader, currentPrice + orderLinePrice, orderLines, currentOrders, usedOrderLines)
        

        if match:
            return match
        
        currentOrders.remove(i)
        usedOrderLines.remove(i)
    
    return None

# Find non-overlapping matches for all order headers
def backtracking(usedOrderLines, result, orderHeaders, orderLines, currentHeaders): 
    if len(result) == len(orderHeaders):
        return result
    

    for i in range(len(orderHeaders)):
        if i in currentHeaders:
            continue

        orderLineMatch = findMatch(orderHeaders[i], 0, orderLines, set([]), usedOrderLines)

        if orderLineMatch:
            result.append(orderLineMatch)
            currentHeaders.add(i)

            overallResult = backtracking(usedOrderLines, result, orderHeaders, orderLines, currentHeaders)
            currentHeaders.remove(i)

            if overallResult:
                return overallResult
        else:
            break
    
    return None

def matchOrderLinesWithHeaders() -> List[Optional[Dict[str, Any]]]:
    orderHeaders = extractCsvData(orderHeadersPath)
    orderLines = extractCsvData(orderLinesPath)

    matches = backtracking(set([]), [], orderHeaders, orderLines, set([]))

    # result = []
    # for match in matches:
    #     endResultMatch = match
    #     orderLineIndexes = endResultMatch["order_lines"]

    #     newOrderLines = []
    #     for orderIndex in orderLineIndexes:
    #         newOrderLines.append(orderLines[orderIndex])
        
    #     endResultMatch["order_lines"] = newOrderLines

    #     result.append(endResultMatch)
        

    
    return matches

print(matchOrderLinesWithHeaders())
