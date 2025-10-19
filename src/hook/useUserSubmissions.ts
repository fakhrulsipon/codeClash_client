import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import useAxiosSecure from './useAxiosSecure';

export interface Submission {
  _id: string;
  userEmail: string;
  userName: string;
  status: "Success" | "Failure";
  problemTitle: string;
  problemDifficulty: string;
  problemCategory: string;
  point: number;
  submittedAt: string;
}

export const useUserSubmissions = () => {
  const { user } = useContext(AuthContext)!;
  const axiosSecure = useAxiosSecure();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosSecure.get(`/api/users/submissions/${user.email}`);
        setSubmissions(res.data || []);
      } catch (error) {
        console.error("Failed to load user submissions:", error);
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [user?.email, axiosSecure]);

  const addSubmission = (submission: Submission) => {
    setSubmissions(prev => [submission, ...prev]);
  };

  const totalSubmissions = submissions.length;
  const successfulSubmissions = submissions.filter(s => s.status === "Success").length;
  const failedSubmissions = totalSubmissions - successfulSubmissions;

  return {
    submissions,
    loading,
    addSubmission,
    totalSubmissions,
    successfulSubmissions,
    failedSubmissions
  };
};