import {
	GetServerSideProps,
	InferGetServerSidePropsType,
	NextPage,
} from "next";
import { unstable_getServerSession } from "next-auth";
import { getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "../components/ui/buttons/Button";
import Modal from "../components/ui/modals/Modal";
import { authOptions } from "./api/auth/[...nextauth]";

const Login: NextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ providers }) => {
	const router = useRouter();

	return (
		<div className="h-screen">
			<Modal
				onDismiss={() => {
					router.push("/");
				}}>
				<h1 className="m-5 text-center text-3xl font-semibold text-primary">
					לחץ למעבר לדף ההתחברות
				</h1>
				<div className="w-full text-center">
					{Object.values(providers).map((provider: any) => (
						<div key={provider.name}>
							<Button
								className="my-5 w-4/6"
								onClick={() =>
									signIn(provider.id, { callbackUrl: "/dashboard" })
								}>
								{provider.name} התחבר באמצעות
							</Button>
						</div>
					))}
				</div>
			</Modal>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const providers = await getProviders();

	const session = await unstable_getServerSession(
		context.req,
		context.res,
		authOptions
	);

	if (session) {
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
		};
	}

	return {
		props: { providers },
	};
};

export default Login;
