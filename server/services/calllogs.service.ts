import { mysqlPool } from '../db/mysql';

export class CallLogsService {
    async getMissedCalls(dateStr: string) {
        const query = `
            SELECT uniqueid, src, disposition, calldate
            FROM cdr
            WHERE calldate >= ?
              AND calldate < DATE_ADD(?, INTERVAL 1 DAY)
              AND disposition = 'NO ANSWER'
              AND lastapp = 'Queue'
            ORDER BY calldate DESC
        `;

        const [rows] = await mysqlPool.query(query, [
            `${dateStr} 00:00:00`,
            `${dateStr} 00:00:00`
        ]);

        return rows;
    }

    async getAnsweredCalls(dateStr: string) {
        const query = `
            SELECT uniqueid, src, disposition, calldate, duration, dstchannel, wa
            FROM cdr
            WHERE calldate >= ?
              AND calldate < DATE_ADD(?, INTERVAL 1 DAY)
              AND disposition = 'ANSWERED'
              AND lastapp = 'Queue'
            ORDER BY calldate DESC
        `;

        const [rows] = await mysqlPool.query(query, [
            `${dateStr} 00:00:00`,
            `${dateStr} 00:00:00`
        ]);

        return rows;
    }

    async getOutboundCalls(dateStr: string) {
        const query = `
            SELECT uniqueid, dst, disposition, calldate, cnam
            FROM cdr
            WHERE calldate >= ?
              AND calldate < DATE_ADD(?, INTERVAL 1 DAY)
              AND disposition = 'ANSWERED'
              AND outbound_cnum = '0797003356'
            ORDER BY calldate DESC
        `;

        const [rows] = await mysqlPool.query(query, [
            `${dateStr} 00:00:00`,
            `${dateStr} 00:00:00`
        ]);

        return rows;
    }

    async searchCustomers(searchTerm: string) {
        const query = `
            SELECT
                calldate,
                src,
                dst,
                disposition,
                duration,
                billsec,
                cnam,
                uniqueid
            FROM cdr
            WHERE src LIKE ?
               OR dst LIKE ?
            ORDER BY calldate DESC
            LIMIT 200
        `;

        const [rows] = await mysqlPool.query(query, [
            `%${searchTerm}%`,
            `%${searchTerm}%`
        ]);

        return rows;
    }
}
