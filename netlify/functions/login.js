import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import tokenStore from "./tokenStore";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function hashPassword(password, Salt) {
  return crypto
    .createHash("sha256")
    .update(Salt + password)
    .digest("hex");
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    console.log("❌ Method not allowed:", event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { username, password } = JSON.parse(event.body);

    console.log("📌 Login attempt:", { username });

    if (!username || !password) {
      console.log("❌ Missing username or password");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Username and password required" })
      };
    }

    // Fetch user from Supabase
    const { data: user, error } = await supabase
      .from("teams")
      .select("team_id, hashed_password, Salt")
      .eq("team_id", username)
      .single();

    console.log("🔍 Supabase result:", { user, error });

    if (error || !user) {
      console.log("❌ User not found or query error");
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid credentials" })
      };
    }

    const hashedPassword = hashPassword(password, user.Salt);

    console.log("🔐 Hash check:", {
      inputHash: hashedPassword,
      storedHash: user.hashed_password
    });

    if (hashedPassword !== user.hashed_password) {
      console.log("❌ Password mismatch");
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid credentials" })
      };
    }

    const token = generateToken();
    tokenStore.add(token, username, 24);

    console.log("✅ Login successful:", { username, token });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        token,
        username
      })
    };

  } catch (err) {
    console.error("🔥 Error in login function:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};
