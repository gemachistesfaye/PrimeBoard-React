export function StatCard({
  title,
  value,
  icon,
  change,
  changeType,
  period,
  data,
}) {
  return (
    <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
      <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>

        {data && <span className="sr-only">{data.length}</span>}
        {period && <p className="text-sm text-slate-500 dark:text-slate-400">{period}</p>}
        {change && (
          <p
            className={`text-xs mt-1 ${
              changeType === "up" ? "text-green-500" : "text-red-500"
            }`}
          >
            {changeType === "up" ? "▲" : "▼"} {change}
          </p>
        )}
      </div>
    </div>
  );
}
export default StatCard;
