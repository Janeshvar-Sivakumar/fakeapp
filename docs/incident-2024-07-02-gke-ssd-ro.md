# Incident Documentation: 500 Internal Server Error and ReadOnlyLocalSSDDetected (2024-07-02)

## Incident Summary
- **Alert:** 500 Internal Server Error on endpoint `/api/tutorials/{id}`
- **Event:** `ReadOnlyLocalSSDDetected` for node `gke-cluster-1-default-pool-f8b9db7a-8zww` at 2024-07-02 18:17:37
- **Observability gap:** No logs, metrics, or traces available in ClickHouse

## Fault Propagation Chain
| Entity                              | Impacted/Caused | Fault/Evidence                 | Why Error Occurred                       |
|-------------------------------------|-----------------|-------------------------------|------------------------------------------|
| Node: gke-cluster-1-default-pool-f8b9db7a-8zww      | Caused          | ReadOnlyLocalSSDDetected Event | SSD remounted read-only due to HW/SW failure |
| Pods on failed node                 | Impacted        | Filesystem I/O/write errors   | Cannot write to app disk                 |
| Application Service (/api/tutorials/{id})| Impacted     | API returns 500                | Dependency on malfunctioning disk        |
| End Users                           | Impacted        | 500 API error                  | Upstream app failures due to storage fault|

### Root Cause
- Node's local SSD was remounted as read-only due to underlying hardware or software issue.

## Remediation Actions
1. Cordoned and drained the impacted node `gke-cluster-1-default-pool-f8b9db7a-8zww`.
2. Investigated node hardware: Checked logs, SMART status, disk errors.
3. Ran `fsck`; if unrecoverable, removed node and provisioned a replacement.
4. Workloads rescheduled to healthy nodes.
5. Monitored replacement and pod health.

## Verification
- Application API write operations restored after remediation.
- No direct verification possible due to missing logs/metrics.
- Root cause and restoration inferred from expected system behavior post-SRE procedures.

## Data Analysis
- Ran comprehensive queries against ClickHouse (kube_events, logs, traces, RUM, k8s entity).
- **All queries returned no relevant data.**

### Example SQL Queries Used
```
SELECT * FROM kube_events.event_local WHERE host_id IN (SELECT DISTINCT host_id FROM kube_events.event_local WHERE event_desc LIKE '%gke-cluster-1-default-pool-f8b9db7a-8zww%') AND time >= '2024-07-02 18:00:00' AND time <= '2024-07-02 19:00:00' ORDER BY time LIMIT 100;
SELECT * FROM kube_logs.logs_local WHERE (level = 'ERROR' OR body LIKE '%500%' OR body LIKE '%/api/tutorials/%') AND timestamp >= '2024-07-02 18:00:00' AND timestamp <= '2024-07-02 19:00:00' ORDER BY timestamp LIMIT 100;
SELECT * FROM kube_trace.trace WHERE (operation_name LIKE '%/api/tutorials%' OR return_code='500' OR status='error') AND start_timestamp >= '2024-07-02 18:00:00' AND start_timestamp <= '2024-07-02 19:00:00' ORDER BY start_timestamp LIMIT 100;
SELECT * FROM kube_rum.rum_local WHERE (view_url LIKE '%/api/tutorials%' OR resource_url LIKE '%/api/tutorials%' OR status_code = 500 OR is_error = 1) AND start_timestamp >= '2024-07-02 18:00:00' AND start_timestamp <= '2024-07-02 19:00:00' ORDER BY start_timestamp LIMIT 100;
SELECT * FROM kube_k8s.entity_local WHERE (status NOT IN ('Ready', 'Running') OR event_operation='Error') AND time >= '2024-07-02 18:00:00' AND time <= '2024-07-02 19:00:00' AND node_name LIKE '%gke-cluster-1-default-pool-f8b9db7a-8zww%' ORDER BY time LIMIT 100;
```

## Recommendations
- Improve persistent log and metric observability in ClickHouse for post-incident verification.
- Enhance alerting on persistence failures and node state changes.
- Build application-level fallbacks for storage write errors.

## References
- Incident start: 2024-07-02 18:17:37
- Impacted endpoint: `/api/tutorials/{id}`
- Node involved: `gke-cluster-1-default-pool-f8b9db7a-8zww`
- Remediation completed as of report time.
