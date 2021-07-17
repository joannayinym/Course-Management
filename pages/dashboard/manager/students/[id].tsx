import { useRouter } from "next/router";
import React from "react";
import MainLayout from "../../../../components/layout/layout";

export default function Page() {
  const router = useRouter();
  const param = router.query.id;
  return <MainLayout>Student Id: {param}</MainLayout>;
}
