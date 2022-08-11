
export const formatNumber = (num) => num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

export const diffInDays = (to, from) => {
    return parseInt((to - from) / (1000 * 60 * 60 * 24), 10);
}