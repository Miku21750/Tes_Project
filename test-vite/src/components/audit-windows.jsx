import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Navigate } from 'react-router'
import { useAuth } from '@/context/auth-context'

export const Auditwindows = () => {
      const { user, loading } = useAuth();

      if (loading) {
          return null;
      }

      if(!user) {
          return <Navigate to="/lorem" replace />
      }
  return (
    <Card className="flex-col mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Action Log</CardTitle>
            <hr />
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">No</TableHead>
                  <TableHead>Change By</TableHead>
                  <TableHead>Old Status</TableHead>
                  <TableHead>New Status</TableHead>
                  <TableHead>Change At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* {actionLogs?.length > 0 ? (
                  actionLogs.map((log, index) => (
                    <TableRow key={log.id || index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{log.changedBy}</TableCell>
                      <TableCell>{log.oldStatus}</TableCell>
                      <TableCell>{log.newStatus}</TableCell>
                      <TableCell>{new Date(log.changedAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                ) : ( */}
                  <TableRow>
                    <TableCell colSpan={5} className="text-center italic">
                      No action logs available.
                    </TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
  )
}
