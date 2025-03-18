import {
  Html,
  Head,
  Preview,
  Section,
  Heading,
  Text,
  Container,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
      </Head>
      
      <Preview>Your verification code: {otp}</Preview>

      <Section
        style={{
          fontFamily: "Arial, sans-serif",
          padding: "20px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Heading as="h2" style={{ color: "#333", textAlign: "center" }}>
            Hello {username},
          </Heading>

          <Text style={{ fontSize: "16px", color: "#555" }}>
            Thank you for registering. Please use the following verification
            code to complete your registration:
          </Text>

          <Text
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "center",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              borderRadius: "5px",
            }}
          >
            {otp}
          </Text>

          <Text
            style={{ fontSize: "14px", color: "#777", textAlign: "center" }}
          >
            If you did not request this code, please ignore this email.
          </Text>
        </Container>
      </Section>
    </Html>
  );
}
