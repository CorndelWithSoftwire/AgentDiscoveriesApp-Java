package org.softwire.training.db.daos;

import org.jdbi.v3.core.Handle;
import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.core.statement.Query;
import org.softwire.training.db.daos.searchcriteria.ReportSearchCriterion;
import org.softwire.training.models.LocationStatusReport;
import org.softwire.training.models.LocationStatusReportWithTimeZone;

import javax.inject.Inject;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class LocationReportsDao implements ReportsDao<LocationStatusReport, LocationStatusReportWithTimeZone> {

    @Inject
    Jdbi jdbi;

    public Optional<LocationStatusReport> getReport(int reportId) {
        try (Handle handle = jdbi.open()) {
            return handle.createQuery("SELECT * FROM agent_location_report WHERE report_id = :report_id")
                    .bind("report_id", reportId)
                    .mapToBean(LocationStatusReport.class)
                    .findFirst();
        }
    }

    public int addReport(LocationStatusReport report) {
        try (Handle handle = jdbi.open()) {
            return handle.createUpdate("INSERT INTO agent_location_report (location_id, call_sign, status, report_time, report_body)" +
                    " VALUES (:location_id, :call_sign, :status, :report_time, :report_body)")
                    .bind("location_id", report.getLocationId())
                    .bind("call_sign", report.getCallSign())
                    .bind("status", report.getStatus())
                    .bind("report_time", report.getReportTime())
                    .bind("report_body", report.getReportBody())
                    .executeAndReturnGeneratedKeys("report_id")
                    .mapTo(Integer.class)
                    .findOnly();
        }
    }

    public int deleteReport(int report_id) {
        try (Handle handle = jdbi.open()) {
            return handle.createUpdate("DELETE FROM agent_location_report WHERE report_id = :report_id")
                    .bind("report_id", report_id)
                    .execute();
        }
    }

    public List<LocationStatusReportWithTimeZone> searchReports(List<ReportSearchCriterion> searchCriteria) {
        String whereClause = ReportsDaoUtils.buildWhereSubClaseFromCriteria(searchCriteria);

        try (Handle handle = jdbi.open()) {
             Query query = handle.createQuery("SELECT agent_location_report.*, location.time_zone as location_time_zone " +
                    "FROM agent_location_report JOIN location " +
                    " ON agent_location_report.location_id = location.location_id" + whereClause);

             for (ReportSearchCriterion criterion : searchCriteria) {
                 for (Map.Entry<String, Object> bindingEntry : criterion.getBindingsForSql().entrySet()) {
                     query.bind(bindingEntry.getKey(), bindingEntry.getValue());
                 }
             }

             return query.mapToBean(LocationStatusReportWithTimeZone.class).list();
        }
    }
}
