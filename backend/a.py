import gym
import numpy as np
import matplotlib.pyplot as plt
import torch
import torch.nn as nn
import torch.optim as optim
np.bool = np.bool_

# Define the policy network (two-layer perceptron)
class PolicyNetwork(nn.Module):
    def __init__(self):
        super(PolicyNetwork, self).__init__()
        self.fc1 = nn.Linear(2, 5)
        self.fc2 = nn.Linear(5, 3)
    
    def forward(self, x):
        x = torch.sigmoid(self.fc1(x))
        return torch.softmax(self.fc2(x), dim=-1)

def reinforce(env, num_episodes=5000):
    policy = PolicyNetwork()
    optimizer = optim.Adam(policy.parameters(), lr=0.01)
    returns = []

    for episode in range(num_episodes):
        state, _ = env.reset()
        done = False
        rewards = []
        log_probs = []

        while not done:
            state_tensor = torch.FloatTensor(state)
            action_probs = policy(state_tensor)
            action = np.random.choice(3, p=action_probs.detach().numpy())
            log_prob = torch.log(action_probs[action])
            
            next_state, reward, terminated, truncated, _ = env.step(action)
            rewards.append(reward)
            log_probs.append(log_prob)
            state = next_state
            done = terminated or truncated  # Update done condition

        # Calculate returns
        total_reward = sum(rewards)
        returns.append(total_reward)

        # Update policy
        for log_prob in log_probs:
            loss = -log_prob * total_reward
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

    return returns

# Run REINFORCE
env = gym.make("MountainCar-v0")
returns_reinforce = reinforce(env)

# Plot results
plt.plot(returns_reinforce)
plt.title("REINFORCE: Return vs. Episode")
plt.xlabel("Episode")
plt.ylabel("Return")
plt.show()