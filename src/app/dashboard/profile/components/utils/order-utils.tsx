// app/lib/order-utils.js

export const OrderState = {
  Pending: "Pending",
  Confirmed: "Confirmed",
  Rejected: "Rejected",
  Started: "Started",
  Finished: "Finished",
  Completed: "Completed",
}

export const getOrderStateLabel = (state) => {
  return state || "All" // Or handle unknown states more gracefully
}

export const getStateBadgeClass = (state) => {
  switch (state) {
    case OrderState.Pending:
      return "border-yellow-500/50 bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30"
    case OrderState.Confirmed:
      return "border-blue-500/50 bg-blue-500/20 text-blue-700 hover:bg-blue-500/30"
    case OrderState.Rejected:
      return "border-red-500/50 bg-red-500/20 text-red-700 hover:bg-red-500/30"
    case OrderState.Started:
      return "border-purple-500/50 bg-purple-500/20 text-purple-700 hover:bg-purple-500/30"
    case OrderState.Finished:
      return "border-teal-500/50 bg-teal-500/20 text-teal-700 hover:bg-teal-500/30"
    case OrderState.Completed:
      return "border-green-500/50 bg-green-500/20 text-green-700 hover:bg-green-500/30"
    default:
      return "border-gray-500/50 bg-gray-500/20 text-gray-700 hover:bg-gray-500/30"
  }
}
