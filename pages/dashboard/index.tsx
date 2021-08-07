import { useRouter } from "next/router";
import React, { useEffect } from "react";
import storage from "../../shared/storage";

export default function Dashboard(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    if (!storage.token) {
      router.push("/login");
    }

    if (!!storage.role) {
      router.push(`/dashboard/${storage.role}`);
    }
  }, [router]);

  return null;
}
